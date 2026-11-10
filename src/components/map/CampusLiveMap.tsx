import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import {
  Bike,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
} from 'lucide-react';
import {
  ALL_OUTLETS_DATA,
  SRM_CAMPUS_CENTER,
  getActiveDeliveryRoute,
  LatLngTuple,
  OutletLocation,
} from '../../data/campusMapData';
import { Order } from '../../types';

interface CampusLiveMapProps {
  order: Order;
  className?: string;
}

export const CampusLiveMap: React.FC<CampusLiveMapProps> = ({ order, className = '' }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const riderMarkerRef = useRef<L.Marker | null>(null);
  const activeRoutePolylineRef = useRef<L.Polyline | null>(null);
  const outletsLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [riderProgress, setRiderProgress] = useState<number>(0.65); // 0 = at restaurant, 1 = at SRM AP
  const [currentSpeed, setCurrentSpeed] = useState<number>(26); // km/h
  const [isFollowingRider, setIsFollowingRider] = useState<boolean>(false);

  // Determine all participating restaurant outlets in this order
  const participatingOutlets: OutletLocation[] = useMemo(() => {
    const ids = new Set<string>();
    if (order.restaurantIds && order.restaurantIds.length > 0) {
      order.restaurantIds.forEach((id) => ids.add(id));
    }
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => {
        if (item.food?.restaurantId) {
          ids.add(item.food.restaurantId);
        }
      });
    }
    if (ids.size === 0 && order.restaurantId) {
      ids.add(order.restaurantId);
    }

    const matched = ALL_OUTLETS_DATA.filter((o) => {
      if (ids.has(o.restaurantId)) return true;
      if (
        order.restaurantNames &&
        order.restaurantNames.some(
          (rn) =>
            o.name.toLowerCase().includes(rn.toLowerCase()) ||
            rn.toLowerCase().includes(o.name.toLowerCase())
        )
      ) {
        return true;
      }
      if (
        order.restaurantName &&
        (o.name.toLowerCase().includes(order.restaurantName.toLowerCase()) ||
          order.restaurantName.toLowerCase().includes(o.name.toLowerCase()))
      ) {
        return true;
      }
      return false;
    });

    if (matched.length > 0) return matched;
    return [ALL_OUTLETS_DATA[0]]; // fallback
  }, [order.restaurantIds, order.restaurantNames, order.restaurantId, order.restaurantName, order.items]);

  // Compute active road route coordinates from Google Maps data directly to SRM University AP
  const activeRouteCoordinates: LatLngTuple[] = useMemo(() => {
    if (participatingOutlets.length === 1) {
      return getActiveDeliveryRoute(participatingOutlets[0].restaurantId);
    }

    // Multi-stop pickup route: sort outlets by distance so courier picks up along corridor to SRM AP
    const sortedOutlets = [...participatingOutlets].sort((a, b) => b.distanceKm - a.distanceKm);
    const coords: LatLngTuple[] = [];

    sortedOutlets.forEach((outlet) => {
      coords.push([outlet.lat, outlet.lng]);
    });

    // Approach route from the closest outlet to SRM AP
    const finalLeg = getActiveDeliveryRoute(sortedOutlets[sortedOutlets.length - 1].restaurantId);
    finalLeg.slice(1).forEach((pt) => coords.push(pt));

    return coords;
  }, [participatingOutlets]);

  // Compute rider position along the route based on progress
  const getPositionAlongRoute = (coords: LatLngTuple[], progress: number): LatLngTuple => {
    if (coords.length === 0) return SRM_CAMPUS_CENTER;
    if (coords.length === 1) return coords[0];

    const clamped = Math.max(0, Math.min(1, progress));
    const totalSegments = coords.length - 1;
    const floatIndex = clamped * totalSegments;
    const index = Math.min(Math.floor(floatIndex), totalSegments - 1);
    const segmentProgress = floatIndex - index;

    const p1 = coords[index];
    const p2 = coords[index + 1];

    const lat = p1[0] + (p2[0] - p1[0]) * segmentProgress;
    const lng = p1[1] + (p2[1] - p1[1]) * segmentProgress;

    return [lat, lng];
  };

  const currentRiderPos = useMemo(() => {
    if (order.status === 'delivered') {
      return activeRouteCoordinates[activeRouteCoordinates.length - 1];
    }
    if (order.status === 'placed' || order.status === 'confirmed') {
      return activeRouteCoordinates[0];
    }
    return getPositionAlongRoute(activeRouteCoordinates, riderProgress);
  }, [activeRouteCoordinates, riderProgress, order.status]);

  // Rider animation ticker: gently moves rider if out_for_delivery
  useEffect(() => {
    if (order.status === 'delivered') {
      setRiderProgress(1.0);
      setCurrentSpeed(0);
      return;
    }

    const interval = setInterval(() => {
      setRiderProgress((prev) => {
        const next = prev + 0.008;
        if (next >= 1.0) {
          return 0.15; // loop gently for live visual demonstration
        }
        return next;
      });

      // Realistic speed variance between 22 and 34 km/h
      setCurrentSpeed(24 + Math.floor(Math.sin(Date.now() / 2000) * 6));
    }, 1200);

    return () => clearInterval(interval);
  }, [order.status]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const container = mapContainerRef.current;
    if ((container as any)._leaflet_id) {
      (container as any)._leaflet_id = null;
      container.innerHTML = '';
    }

    // OpenStreetMap standard tiles - clean real roads, zero watermark, no API key required
    const baseTileLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: ['a', 'b', 'c'],
        maxZoom: 19,
      }
    );

    const map = L.map(container, {
      center: [16.4580, 80.5250],
      zoom: 13,
      zoomControl: false,
      layers: [baseTileLayer],
    });

    mapInstanceRef.current = map;

    // Trigger invalidateSize after initial render
    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    const handleWindowResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleWindowResize);

    // Layer group for ordered restaurants
    const outletsGroup = L.layerGroup().addTo(map);
    outletsLayerGroupRef.current = outletsGroup;

    // Clean up on unmount
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleWindowResize);
      map.remove();
      mapInstanceRef.current = null;
      riderMarkerRef.current = null;
      activeRoutePolylineRef.current = null;
      outletsLayerGroupRef.current = null;
    };
  }, []);

  // Update SRM University AP Campus Marker (Single Clean Landmark)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const srmCampusLayerGroup = L.layerGroup().addTo(map);

    // Sole SRM University AP Pin
    const srmCoreIcon = L.divIcon({
      className: 'srm-campus-pin',
      html: `
        <div style="display:flex; flex-direction:column; align-items:center;">
          <div style="background:#059669; color:#fff; padding:6px 12px; border-radius:12px; font-weight:800; font-size:11px; box-shadow:0 8px 20px rgba(5,150,105,0.45); border:2px solid #ffffff; display:flex; align-items:center; gap:6px; white-space:nowrap;">
            <span style="font-size:15px;">🎓</span> SRM University AP
          </div>
          <div style="width:2.5px; height:8px; background:#059669; border-radius:1px;"></div>
        </div>
      `,
      iconSize: [160, 40],
      iconAnchor: [80, 40],
    });

    L.marker(SRM_CAMPUS_CENTER, { icon: srmCoreIcon })
      .bindPopup(
        `<div style="font-family:inherit; min-width:200px;">
          <h4 style="font-weight:800; font-size:13px; margin:0 0 4px 0; color:#059669;">🎓 SRM University AP</h4>
          <p style="font-size:11px; margin:0 0 6px 0; color:#475569;">Central Academic Campus, Neerukonda, Amaravati, Andhra Pradesh 522240</p>
          <div style="font-size:10px; background:#ecfdf5; color:#065f46; padding:3px 6px; border-radius:6px; font-weight:700;">
            ✓ Delivery Destination: SRM University AP
          </div>
        </div>`
      )
      .addTo(srmCampusLayerGroup);

    return () => {
      srmCampusLayerGroup.remove();
    };
  }, []);

  // Update Participating Restaurant Markers (ONLY the restaurants from which the order was placed)
  useEffect(() => {
    const group = outletsLayerGroupRef.current;
    if (!group) return;

    group.clearLayers();

    participatingOutlets.forEach((outlet, index) => {
      const isMulti = participatingOutlets.length > 1;
      const pickupBadge = isMulti ? `[Stop ${index + 1}] ` : '';

      const outletIcon = L.divIcon({
        className: 'ordered-restaurant-pin',
        html: `
          <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;">
            <div style="
              background: #ea580c;
              color: #ffffff;
              padding: 6px 12px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 800;
              border: 2.5px solid #ffffff;
              box-shadow: 0 8px 22px rgba(234,88,12,0.45);
              display: flex;
              align-items: center;
              gap: 6px;
              white-space: nowrap;
            ">
              <span style="font-size: 15px;">🏪</span> ${pickupBadge}${outlet.name}
            </div>
            <div style="width: 2.5px; height: 8px; background: #ea580c; border-radius: 1px;"></div>
          </div>
        `,
        iconSize: [210, 42],
        iconAnchor: [105, 42],
      });

      const marker = L.marker([outlet.lat, outlet.lng], { icon: outletIcon });

      marker.bindPopup(
        `<div style="font-family:inherit; min-width:210px; padding:2px;">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
            <h4 style="font-weight:800; font-size:13px; margin:0; color:#ea580c;">🏪 ${pickupBadge}${outlet.name}</h4>
            <span style="background:#ecfdf5; color:#065f46; font-size:11px; font-weight:800; padding:1px 5px; border-radius:4px;">★ ${outlet.rating}</span>
          </div>
          <p style="font-size:11px; color:#64748b; margin:4px 0 6px 0;">${outlet.address}</p>
          <div style="display:flex; align-items:center; gap:8px; font-size:11px; font-weight:700; color:#334155; margin-bottom:6px;">
            <span>📍 ~${outlet.distanceKm} km to SRM AP</span>
            <span>⏱ ${outlet.deliveryTime} mins</span>
          </div>
          <div style="font-size:10px; color:#ea580c; background:#fff7ed; padding:3px 6px; border-radius:4px; font-weight:700;">
            ${outlet.cuisines.join(' • ')}
          </div>
          <div style="margin-top:6px; background:#ea580c; color:#ffffff; text-align:center; padding:3px; border-radius:4px; font-size:10px; font-weight:800;">
            ${isMulti ? `✓ MULTI-RESTAURANT PICKUP STOP ${index + 1}` : '✓ ORDER ORIGIN RESTAURANT'}
          </div>
        </div>`
      );

      marker.addTo(group);
    });
  }, [participatingOutlets]);

  // Update Active Delivery Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (activeRoutePolylineRef.current) {
      activeRoutePolylineRef.current.remove();
    }

    // Outer Glow / Border Line
    const casing = L.polyline(activeRouteCoordinates, {
      color: '#ffffff',
      weight: 8,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    // Vibrant Orange Delivery Line
    const activeLine = L.polyline(activeRouteCoordinates, {
      color: '#f97316',
      weight: 5,
      opacity: 1,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    activeRoutePolylineRef.current = activeLine;

    // Fit bounds to show all participating restaurants and SRM AP clearly
    map.fitBounds(activeLine.getBounds(), { padding: [50, 50], maxZoom: 15 });

    return () => {
      casing.remove();
      activeLine.remove();
      activeRoutePolylineRef.current = null;
    };
  }, [activeRouteCoordinates]);

  // Update Rider Live Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (riderMarkerRef.current) {
      riderMarkerRef.current.setLatLng(currentRiderPos);
    } else {
      const riderIcon = L.divIcon({
        className: 'rider-live-pin',
        html: `
          <div style="display:flex; flex-direction:column; align-items:center;">
            <div style="
              width: 38px;
              height: 38px;
              border-radius: 50%;
              background: #ea580c;
              border: 3px solid #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 20px rgba(234,88,12,0.9), 0 4px 12px rgba(0,0,0,0.35);
              color: #ffffff;
              font-size: 20px;
              animation: rider-pulse 2s infinite;
            ">
              🚴
            </div>
            <div style="
              margin-top: 3px;
              background: #0f172a;
              color: #fdba74;
              font-size: 10px;
              font-weight: 800;
              padding: 2px 7px;
              border-radius: 9999px;
              border: 1px solid rgba(253,186,116,0.5);
              white-space: nowrap;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
              ${order.status === 'delivered' ? '✓ Arrived at SRM AP!' : `Rider: ${currentSpeed} km/h`}
            </div>
          </div>
        `,
        iconSize: [120, 64],
        iconAnchor: [60, 32],
      });

      const riderMarker = L.marker(currentRiderPos, { icon: riderIcon, zIndexOffset: 1000 }).addTo(map);
      riderMarker.bindPopup(
        `<div style="font-family:inherit; min-width:180px;">
          <h4 style="font-weight:800; font-size:12px; margin:0 0 2px 0; color:#ea580c;">🚀 Courier on Campus E-Bike</h4>
          <p style="font-size:11px; color:#475569; margin:0 0 4px 0;">Speed: <strong>${currentSpeed} km/h</strong> • Green Campus EV Fleet</p>
          <div style="font-size:10px; background:#ffedd5; color:#c2410c; padding:3px 6px; border-radius:4px; font-weight:700;">
            En route to SRM University AP
          </div>
        </div>`
      );

      riderMarkerRef.current = riderMarker;
    }

    if (isFollowingRider && map) {
      map.panTo(currentRiderPos, { animate: true, duration: 0.8 });
    }
  }, [currentRiderPos, currentSpeed, order.status, isFollowingRider]);

  // Controls Handlers
  const handleCenterOnRider = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(currentRiderPos, 15, { animate: true });
      setIsFollowingRider(true);
    }
  };

  const handleCenterOnCampus = () => {
    if (mapInstanceRef.current) {
      setIsFollowingRider(false);
      mapInstanceRef.current.setView(SRM_CAMPUS_CENTER, 15, { animate: true });
    }
  };

  const handleFitOrderRoute = () => {
    if (mapInstanceRef.current) {
      setIsFollowingRider(false);
      const points: LatLngTuple[] = [
        ...participatingOutlets.map((o): LatLngTuple => [o.lat, o.lng]),
        SRM_CAMPUS_CENTER,
      ];
      const bounds = L.latLngBounds(points);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl bg-slate-900 ${className}`}
      style={{ height: '460px', minHeight: '400px', width: '100%' }}
    >
      {/* Real Interactive Leaflet Container */}
      <div
        ref={mapContainerRef}
        className="w-full z-0 focus:outline-none"
        style={{ height: '460px', minHeight: '400px', width: '100%', background: '#f8fafc' }}
      />

      {/* Top-Right Floating Map Tool Controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-[400]">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleCenterOnRider}
          title="Center on Rider"
          className="bg-orange-500 hover:bg-orange-600 text-white w-9 h-9 rounded-2xl shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        >
          <Bike className="w-5 h-5" />
        </button>

        <button
          onClick={handleCenterOnCampus}
          title="Center on SRM AP Campus"
          className="bg-emerald-600 hover:bg-emerald-700 text-white w-9 h-9 rounded-2xl shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        >
          <Compass className="w-5 h-5" />
        </button>

        <button
          onClick={handleFitOrderRoute}
          title="Fit View to Restaurants & SRM AP"
          className="bg-slate-800/90 hover:bg-slate-700 text-white w-9 h-9 rounded-2xl shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
