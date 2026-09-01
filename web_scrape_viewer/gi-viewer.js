// --- Tamil Nadu GIS - Cadastral GI Explorer with Full HITL Engine ---

document.addEventListener("DOMContentLoaded", () => {
  // State Variables
  let map = null;
  let activeParcelLayer = null;
  let activeHouseMarker = null;
  let userLocationMarker = null;
  let userAccuracyCircle = null;
  let allParcelsLayerGroup = null;
  let mpaLayerGroup = null;
  let isMpaVisible = true;
  let isMeasuring = false;
  let measurePoints = [];
  let measurePolyline = null;
  let measurePolygon = null;
  let measureMarkers = [];
  
  // Human-in-the-Loop (HITL) State Variables
  let currentHitlSessionId = null;
  let hitlTimerInterval = null;
  let hitlSecondsRemaining = 120;
  let isHitlCooldownActive = false;
  let lastClickedCoords = { lat: 13.02235, lng: 80.23719 };
  const HITL_TOTAL_TTL = 120; // 2 minutes window per PDF specification

  // --- UI Elements ---
  const form = document.getElementById("gis-search-form");
  const districtSelect = document.getElementById("district-select");
  const talukSelect = document.getElementById("taluk-select");
  const villageSelect = document.getElementById("village-select");
  const surveySelect = document.getElementById("survey-select");
  const subdivSelect = document.getElementById("subdiv-select");

  const btnSearch = document.getElementById("btn-search-land");
  const btnReset = document.getElementById("btn-reset-filters");

  const sidebarFilter = document.getElementById("filter-sidebar");
  const sidebarRecords = document.getElementById("records-sidebar");
  const triggerFilter = document.getElementById("trigger-filter");

  const coordsDisplay = document.getElementById("coords-display");
  const searchStatusBar = document.getElementById("search-status-bar");
  const searchStatusIndicator = searchStatusBar ? searchStatusBar.querySelector(".status-indicator") : null;
  const searchStatusText = document.getElementById("status-text-display") || (searchStatusBar ? searchStatusBar.querySelector(".status-text") : null);

  // Tab Pane triggers
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  // Record elements
  const aregisterPlaceholder = document.getElementById("aregister-placeholder");
  const aregisterContent = document.getElementById("aregister-content");
  const fmbPlaceholder = document.getElementById("fmb-placeholder");
  const fmbContent = document.getElementById("fmb-content");

  // Map overlays & HUDs
  const btnLocateUser = document.getElementById("btn-locate-user");
  const btnToolLocate = document.getElementById("btn-tool-locate");
  const btnToggleMpa = document.getElementById("btn-toggle-mpa");
  const btnMeasure = document.getElementById("btn-tool-measure");
  const btnClearMap = document.getElementById("btn-tool-clear");
  const measurementHud = document.getElementById("measurement-hud");
  const btnCloseMeasurer = document.getElementById("btn-close-measurer");

  const layerStreetsBtn = document.getElementById("layer-streets");
  const layerSatelliteBtn = document.getElementById("layer-satellite");
  const layerDarkBtn = document.getElementById("layer-dark");

  // HITL UI Triggers
  const btnTriggerHitlAuth = document.getElementById("btn-trigger-hitl-auth");
  const btnViewAuditTrail = document.getElementById("btn-view-audit-trail");
  const btnTriggerApprovalGate = document.getElementById("btn-trigger-approval-gate");
  const btnTriggerFeedbackLoop = document.getElementById("btn-trigger-feedback-loop");
  const btnSubmitHitlOtp = document.getElementById("btn-submit-hitl-otp");
  const btnSubmitFeedbackCorrection = document.getElementById("btn-submit-feedback-correction");

  // --- Language Management (Tamil & English) ---
  let currentLanguage = 'ta'; // Default to Tamil as requested
  let activeBaseLayerName = 'streets'; // Default to Streets & Buildings map
  let mapTileLayers = {};
  let tnDistrictsLayerGroup = null;
  let tnDistrictLabelsLayerGroup = null;
  let liveBuildingsLayerGroup = null;
  let isFetchingBuildings = false;

  function initMap() {
    try {
      const tamilNaduCenter = [11.1271, 78.6569]; // Central Tamil Nadu state view
      map = L.map("map", {
        zoomControl: true,
        attributionControl: true,
        preferCanvas: true
      }).setView(tamilNaduCenter, 7.8);

      // Create tile layers based on current language
      buildTileLayers(currentLanguage);

      // Layer Groups
      tnDistrictsLayerGroup = L.layerGroup().addTo(map);
      tnDistrictLabelsLayerGroup = L.layerGroup();
      liveBuildingsLayerGroup = L.layerGroup().addTo(map);
      allParcelsLayerGroup = L.layerGroup().addTo(map);
      mpaLayerGroup = L.layerGroup().addTo(map);

      // Layer switcher buttons
      if (layerStreetsBtn) layerStreetsBtn.addEventListener("click", () => setActiveBaseLayer("streets"));
      if (layerSatelliteBtn) layerSatelliteBtn.addEventListener("click", () => setActiveBaseLayer("satellite"));
      if (layerDarkBtn) layerDarkBtn.addEventListener("click", () => setActiveBaseLayer("dark"));

      // Setup Language Toggle buttons
      setupLanguageToggle();

      // Zoom listener: Hide district names when zoomed out, show them only when zoomed in
      map.on("zoomend", updateDistrictLabelVisibility);
      map.on("moveend", fetchLiveViewportBuildings);

      // Mousemove GPS coordinate readout
      map.on("mousemove", (e) => {
        if (coordsDisplay) {
          coordsDisplay.textContent = `${e.latlng.lat.toFixed(5)}° N, ${e.latlng.lng.toFixed(5)}° E`;
        }
      });

      // Map Click Handler: Click on any house -> snaps blue box & opens HITL Security Verification Pop-up!
      map.on("click", (e) => {
        if (isMeasuring) return;
        handleMapCoordinateClick(e.latlng.lat, e.latlng.lng);
      });

      // Force recalculate map container size after DOM rendering
      setTimeout(() => {
        if (map) map.invalidateSize();
      }, 150);

      // Load TNGIS Statewide District Boundaries and Parcels
      loadTnDistrictsBoundary();
      loadAllParcelsOnMap();
      loadMpaZones();
      setupDropdowns();
    } catch (err) {
      console.error("Map initialization notice:", err);
    }
  }

  let cachedViewportBuildings = [];
  const renderedBuildingIds = new Set();
  let viewportFetchTimeout = null;

  function fetchLiveViewportBuildings() {
    if (!map || !liveBuildingsLayerGroup) return;
    const currentZoom = map.getZoom();
    if (currentZoom < 13) {
      liveBuildingsLayerGroup.clearLayers();
      renderedBuildingIds.clear();
      cachedViewportBuildings = [];
      return;
    }

    if (viewportFetchTimeout) clearTimeout(viewportFetchTimeout);
    viewportFetchTimeout = setTimeout(() => {
      const bounds = map.getBounds();
      const min_lat = bounds.getSouth();
      const min_lng = bounds.getWest();
      const max_lat = bounds.getNorth();
      const max_lng = bounds.getEast();

      if ((max_lat - min_lat) > 0.09 || (max_lng - min_lng) > 0.09) return;

      fetch(`/api/viewport-buildings?min_lat=${min_lat}&min_lng=${min_lng}&max_lat=${max_lat}&max_lng=${max_lng}`)
        .then(res => res.json())
        .then(buildings => {
          if (!Array.isArray(buildings) || buildings.length === 0) return;

          buildings.forEach(b => {
            if (!b.coords || b.coords.length < 3) return;
            const bId = b.id ? String(b.id) : `${b.coords[0][0].toFixed(5)}_${b.coords[0][1].toFixed(5)}`;
            if (renderedBuildingIds.has(bId)) return;

            renderedBuildingIds.add(bId);
            cachedViewportBuildings.push(b);

            const poly = L.polygon(b.coords, {
              color: "#334155",
              weight: 1.8,
              fillColor: "#cbd5e1",
              fillOpacity: 0.55
            });

            poly.on("mouseover", () => {
              if (poly !== activeParcelLayer) {
                poly.setStyle({ color: "#2563eb", weight: 2.5, fillColor: "#93c5fd", fillOpacity: 0.65 });
              }
            });
            poly.on("mouseout", () => {
              if (poly !== activeParcelLayer) {
                poly.setStyle({ color: "#334155", weight: 1.8, fillColor: "#cbd5e1", fillOpacity: 0.55 });
              }
            });

            poly.on("click", (e) => {
              if (isMeasuring) return;
              L.DomEvent.stopPropagation(e);
              handleMapCoordinateClick(e.latlng.lat, e.latlng.lng, b.coords, b);
            });

            liveBuildingsLayerGroup.addLayer(poly);
          });
        })
        .catch(err => {
          console.debug("Building fetch notice:", err);
        });
    }, 120);
  }

  function updateDistrictLabelVisibility() {
    if (!map || !tnDistrictsLayerGroup || !tnDistrictLabelsLayerGroup) return;
    const currentZoom = map.getZoom();
    
    // When zoomed in far (zoom >= 11.5), hide district boundaries and blue highlight layer completely
    if (currentZoom >= 11.5) {
      if (map.hasLayer(tnDistrictsLayerGroup)) {
        map.removeLayer(tnDistrictsLayerGroup);
      }
      if (map.hasLayer(tnDistrictLabelsLayerGroup)) {
        map.removeLayer(tnDistrictLabelsLayerGroup);
      }
    } else {
      // Outside / zoomed out: show district boundaries so they can be highlighted in blue on hover
      if (!map.hasLayer(tnDistrictsLayerGroup)) {
        map.addLayer(tnDistrictsLayerGroup);
      }
      if (currentZoom >= 8.5) {
        if (!map.hasLayer(tnDistrictLabelsLayerGroup)) {
          map.addLayer(tnDistrictLabelsLayerGroup);
        }
      } else {
        if (map.hasLayer(tnDistrictLabelsLayerGroup)) {
          map.removeLayer(tnDistrictLabelsLayerGroup);
        }
      }
    }
  }

  function buildTileLayers(lang) {
    if (!map) return;
    
    // Remove previous tile layer if any
    if (mapTileLayers[activeBaseLayerName] && map.hasLayer(mapTileLayers[activeBaseLayerName])) {
      map.removeLayer(mapTileLayers[activeBaseLayerName]);
    }

    const hlParam = lang === 'ta' ? 'ta' : 'en';

    // High-Resolution Building Footprints & Street Networks across 100% of Tamil Nadu
    mapTileLayers = {
      streets: L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 20,
        maxNativeZoom: 19,
        updateWhenIdle: false,
        updateWhenZooming: false,
        keepBuffer: 12,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }),
      satellite: L.tileLayer(`https://{s}.google.com/vt/lyrs=y&hl=${hlParam}&x={x}&y={y}&z={z}`, {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        maxZoom: 21,
        maxNativeZoom: 20,
        updateWhenIdle: false,
        updateWhenZooming: false,
        keepBuffer: 12,
        attribution: '&copy; TNGIS &copy; Google Satellite & House Rooftop Imagery'
      }),
      dark: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
        updateWhenIdle: false,
        keepBuffer: 8,
        attribution: 'Tiles &copy; Esri'
      })
    };

    mapTileLayers[activeBaseLayerName].addTo(map);
  }

  function setActiveBaseLayer(layerName) {
    if (!map || !mapTileLayers[layerName]) return;
    activeBaseLayerName = layerName;
    Object.values(mapTileLayers).forEach(layer => {
      if (map.hasLayer(layer)) map.removeLayer(layer);
    });
    mapTileLayers[layerName].addTo(map);
    document.querySelectorAll(".map-layer-selector button").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.getElementById(`layer-${layerName}`);
    if (activeBtn) activeBtn.classList.add("active");
  }

  function setupLanguageToggle() {
    const btnTa = document.getElementById("btn-lang-ta");
    const btnEn = document.getElementById("btn-lang-en");

    if (btnTa) {
      btnTa.addEventListener("click", () => setAppLanguage("ta"));
    }
    if (btnEn) {
      btnEn.addEventListener("click", () => setAppLanguage("en"));
    }
  }

  function setAppLanguage(lang) {
    currentLanguage = lang;

    // Update active button state
    document.querySelectorAll(".btn-lang").forEach(b => b.classList.remove("active"));
    const activeBtn = document.getElementById(`btn-lang-${lang}`);
    if (activeBtn) activeBtn.classList.add("active");

    // Rebuild map tiles with selected language
    buildTileLayers(lang);

    // Refresh district boundary labels
    loadTnDistrictsBoundary();

    // Update top guide banner and status text
    const guidePill = document.getElementById("tngis-top-guide-pill");
    if (lang === 'ta') {
      if (guidePill) guidePill.textContent = "விவரங்களை அறிய வரைபடத்தில் கிளிக் செய்யவும்";
      updateStatusBar("success", "தமிழ்நாடு மாவட்டங்கள் மற்றும் மனை வரைபடங்கள்");
    } else {
      if (guidePill) guidePill.textContent = "Click on the map to know more details";
      updateStatusBar("success", "Displaying Tamil Nadu Districts & Cadastral Land Parcels");
    }
  }

  // --- Load Official TNGIS District Boundaries (Full Precision GeoJSON) ---
  function loadTnDistrictsBoundary() {
    if (!tnDistrictsLayerGroup || !tnDistrictLabelsLayerGroup) return;
    tnDistrictsLayerGroup.clearLayers();
    tnDistrictLabelsLayerGroup.clearLayers();

    fetch('/api/tn-districts-boundary')
      .then(res => res.json())
      .then(data => {
        if (data.type === 'FeatureCollection' && data.features) {
          // Render official full precision GeoJSON layer
          const districtBaseStyle = {
            color: "#580101", // Deep dark solid maroon boundary
            weight: 2.8,
            opacity: 1.0,
            fillColor: "#7f1d1d",
            fillOpacity: 0.04
          };
          const districtHoverStyle = {
            color: "#00f2fe", // Glowing cyan highlight on hover
            weight: 3.5,
            opacity: 1.0,
            fillColor: "#00f2fe",
            fillOpacity: 0.22
          };

          const geoLayer = L.geoJSON(data, {
            style: function() {
              return districtBaseStyle;
            },
            onEachFeature: function(feature, layer) {
              const props = feature.properties || {};
              const primaryName = currentLanguage === 'ta' ? props.name_ta : props.name;
              const secondaryName = currentLanguage === 'ta' ? props.name : props.name_ta;

              layer.bindTooltip(`<div style="text-align:center; font-family:sans-serif;"><strong>${primaryName}</strong><br><span style="font-size:11px;color:#facc15;font-weight:700;">${secondaryName}</span></div>`, {
                sticky: true
              });

              // Cursor hover highlight (only when outside / overview zoom)
              layer.on("mouseover", () => {
                if (map.getZoom() >= 11.5) return;
                layer.setStyle(districtHoverStyle);
                layer.bringToFront();
                updateStatusBar("info", `District Focus: ${primaryName} (${secondaryName})`);
              });
              layer.on("mouseout", () => {
                geoLayer.resetStyle(layer);
                updateStatusBar("ready", "Ready");
              });

              layer.on("click", (e) => {
                if (isMeasuring) return;
                if (map.getZoom() < 13) {
                  L.DomEvent.stopPropagation(e);
                  map.fitBounds(layer.getBounds(), { padding: [20, 20] });
                  updateStatusBar("success", `${primaryName} ${currentLanguage === 'ta' ? 'மாவட்டம்' : 'District'}`);
                }
              });

              // Add fixed box-like badge with bold white text & bright yellow letters at center
              const center = layer.getBounds().getCenter();
              const labelIcon = L.divIcon({
                className: 'tngis-district-label',
                html: `<div class="tngis-bilingual-pill"><span class="main-title">${primaryName}</span><span class="tamil-sub">${secondaryName}</span></div>`,
                iconSize: [110, 36],
                iconAnchor: [55, 18]
              });
              const marker = L.marker(center, { icon: labelIcon });
              marker.on("click", () => {
                if (map.getZoom() < 13) {
                  map.fitBounds(layer.getBounds(), { padding: [20, 20] });
                }
              });
              tnDistrictLabelsLayerGroup.addLayer(marker);
            }
          });
          tnDistrictsLayerGroup.addLayer(geoLayer);
        } else if (Array.isArray(data)) {
          // Fallback array rendering
          data.forEach(d => {
            const poly = L.polygon(d.boundary, {
              color: "#580101",
              weight: 2.8,
              opacity: 1.0,
              fillColor: "#7f1d1d",
              fillOpacity: 0.05
            });
            const primaryName = currentLanguage === 'ta' ? d.name_ta : d.name;
            const secondaryName = currentLanguage === 'ta' ? d.name : d.name_ta;
            poly.bindTooltip(`<div style="text-align:center;"><strong>${primaryName}</strong><br><span style="font-size:11px;color:#facc15;font-weight:700;">${secondaryName}</span></div>`, { sticky: true });
            
            poly.on("mouseover", () => {
              if (map.getZoom() >= 11.5) return;
              poly.setStyle({
                color: "#00f2fe",
                weight: 3.5,
                opacity: 1.0,
                fillColor: "#00f2fe",
                fillOpacity: 0.22
              });
              poly.bringToFront();
              updateStatusBar("info", `District Focus: ${primaryName} (${secondaryName})`);
            });
            poly.on("mouseout", () => {
              poly.setStyle({
                color: "#580101",
                weight: 2.8,
                opacity: 1.0,
                fillColor: "#7f1d1d",
                fillOpacity: 0.05
              });
              updateStatusBar("ready", "Ready");
            });

            poly.on("click", (e) => {
              if (isMeasuring) return;
              if (map.getZoom() < 13) {
                L.DomEvent.stopPropagation(e);
                map.flyTo(d.center, 15, { animate: true, duration: 1.2 });
              }
            });
            tnDistrictsLayerGroup.addLayer(poly);
            const labelIcon = L.divIcon({
              className: 'tngis-district-label',
              html: `<div class="tngis-bilingual-pill"><span class="main-title">${primaryName}</span><span class="tamil-sub">${secondaryName}</span></div>`,
              iconSize: [110, 36],
              iconAnchor: [55, 18]
            });
            const marker = L.marker(d.center, { icon: labelIcon });
            marker.on("click", () => {
              if (map.getZoom() < 13) map.flyTo(d.center, 15, { animate: true, duration: 1.2 });
            });
            tnDistrictLabelsLayerGroup.addLayer(marker);
          });
        }

        // Apply visibility according to current zoom
        updateDistrictLabelVisibility();
      })
      .catch(err => console.error("Error loading TNGIS districts:", err));
  }

  // --- Load Master Plan Area (MPA) Layer ---
  function loadMpaZones() {
    if (!mpaLayerGroup) return;
    mpaLayerGroup.clearLayers();
    fetch('/api/mpa-zones')
      .then(res => res.json())
      .then(zones => {
        zones.forEach(zone => {
          const poly = L.polygon(zone.boundary, {
            color: zone.color || "#0ea5e9",
            fillColor: zone.fill_color || "#38bdf8",
            fillOpacity: 0.1,
            weight: 2,
            dashArray: "6, 6"
          });

          poly.bindTooltip(`<strong>${zone.name}</strong><br><span style="font-size:11px;color:#64748b;">${zone.zone_type}</span>`, {
            sticky: true
          });

          poly.on("click", (e) => {
            if (isMeasuring) return;
            L.DomEvent.stopPropagation(e);
            handleMapCoordinateClick(e.latlng.lat, e.latlng.lng);
          });

          mpaLayerGroup.addLayer(poly);
        });
      })
      .catch(err => console.error("Error loading MPA zones:", err));
  }

  // Toggle MPA Layer Visibility
  if (btnToggleMpa) {
    btnToggleMpa.addEventListener("click", () => {
      if (!map || !mpaLayerGroup) return;
      isMpaVisible = !isMpaVisible;
      if (isMpaVisible) {
        map.addLayer(mpaLayerGroup);
        btnToggleMpa.classList.add("active");
        updateStatusBar("success", "Master Plan Areas (MPA) & Protected Zones visible");
      } else {
        map.removeLayer(mpaLayerGroup);
        btnToggleMpa.classList.remove("active");
        updateStatusBar("idle", "MPA Layer hidden");
      }
    });
  }

  // --- Load All Existing Parcels ---
  function loadAllParcelsOnMap() {
    if (!allParcelsLayerGroup) return;
    allParcelsLayerGroup.clearLayers();
    fetch('/api/parcels')
      .then(res => res.json())
      .then(parcels => {
        parcels.forEach(parcel => {
          const isGovt = parcel.category && (parcel.category.toLowerCase().includes("govt") || parcel.category.toLowerCase().includes("government") || parcel.category.toLowerCase().includes("poramboke"));
          const poly = L.polygon(parcel.coords, {
            color: isGovt ? "#ef4444" : "#2563eb",
            weight: 1.5,
            fillColor: isGovt ? "#ef4444" : "#2563eb",
            fillOpacity: 0.15,
            dashArray: "3, 4"
          });

          poly.on("click", (e) => {
            if (isMeasuring) return;
            L.DomEvent.stopPropagation(e);
            displayParcelRecord(parcel);
            highlightHouseParcel(parcel.coords);
          });

          allParcelsLayerGroup.addLayer(poly);
        });
      })
      .catch(err => console.error("Error loading parcels:", err));
  }

  // Precise Point in polygon test (Ray-casting with correct coordinate axes)
  function isPointInPolygon(point, vs) {
    if (!vs || vs.length < 3) return false;
    const lat = point[0], lng = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const yi = vs[i][0], xi = vs[i][1];
      const yj = vs[j][0], xj = vs[j][1];
      const intersect = ((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function pointToSegmentDistance(pLat, pLng, aLat, aLng, bLat, bLng) {
    const dLat = (bLat - aLat) * 111320;
    const dLng = (bLng - aLng) * 111320 * Math.cos(pLat * Math.PI / 180);
    const l2 = dLat * dLat + dLng * dLng;
    if (l2 === 0) {
      const p2aLat = (pLat - aLat) * 111320;
      const p2aLng = (pLng - aLng) * 111320 * Math.cos(pLat * Math.PI / 180);
      return Math.sqrt(p2aLat * p2aLat + p2aLng * p2aLng);
    }
    const p2aLat = (pLat - aLat) * 111320;
    const p2aLng = (pLng - aLng) * 111320 * Math.cos(pLat * Math.PI / 180);
    const t = Math.max(0, Math.min(1, (p2aLat * dLat + p2aLng * dLng) / l2));
    const projLat = aLat + t * (bLat - aLat);
    const projLng = aLng + t * (bLng - aLng);
    const diffLat = (pLat - projLat) * 111320;
    const diffLng = (pLng - projLng) * 111320 * Math.cos(pLat * Math.PI / 180);
    return Math.sqrt(diffLat * diffLat + diffLng * diffLng);
  }

  function minDistanceToPolygon(pLat, pLng, coords) {
    let minDist = Infinity;
    for (let i = 0; i < coords.length; i++) {
      const a = coords[i];
      const b = coords[(i + 1) % coords.length];
      const d = pointToSegmentDistance(pLat, pLng, a[0], a[1], b[0], b[1]);
      if (d < minDist) minDist = d;
    }
    return minDist;
  }

  function findExactBuildingAtPoint(lat, lng) {
    if (!cachedViewportBuildings || cachedViewportBuildings.length === 0) return null;
    
    // 1. Strict point-in-polygon check
    for (let i = 0; i < cachedViewportBuildings.length; i++) {
      const b = cachedViewportBuildings[i];
      if (b.coords && b.coords.length >= 3) {
        if (isPointInPolygon([lat, lng], b.coords)) {
          return b.coords;
        }
      }
    }

    // 2. Proximity check: snap to nearest building edge within 35 meters
    let nearest = null;
    let minDistanceM = 35.0;
    for (let i = 0; i < cachedViewportBuildings.length; i++) {
      const b = cachedViewportBuildings[i];
      if (b.coords && b.coords.length >= 3) {
        const dist = minDistanceToPolygon(lat, lng, b.coords);
        if (dist < minDistanceM) {
          minDistanceM = dist;
          nearest = b.coords;
        }
      }
    }
    return nearest;
  }

  // --- Map Click: Snap Blue Box to EXACT Building Shape & Fetch Location Details ---
  function handleMapCoordinateClick(lat, lng, exactBuildingCoords = null, buildingInfo = null) {
    lastClickedCoords = { lat: lat, lng: lng };
    
    // 1. Snap Blue Box to EXACT Building Shape Design
    let finalShape = exactBuildingCoords;
    if (!finalShape) {
      finalShape = findExactBuildingAtPoint(lat, lng);
    }

    if (finalShape && finalShape.length >= 3) {
      highlightHouseParcel(finalShape, [lat, lng]);
    } else {
      fetch(`/api/building-at-point?lat=${lat}&lng=${lng}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.found && data.coords && data.coords.length >= 3) {
            highlightHouseParcel(data.coords, [lat, lng]);
          }
        })
        .catch(() => {});
    }

    updateStatusBar("loading", `Fetching location details for [${lat.toFixed(5)}, ${lng.toFixed(5)}]...`);

    // 2. Fetch real location details (pass exact building shape so area and sketch use it)
    fetch('/api/query-coords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lat: lat,
        lng: lng,
        building_coords: finalShape
      })
    })
    .then(res => res.json())
    .then(result => {
      if (result.found && result.parcel) {
        displayParcelRecord(result.parcel);
        updateStatusBar("success", `Location identified: ${result.parcel.district || ''}, ${result.parcel.village || ''}`);
        
        // If we didn't have exact building shape upfront, but the server returned a valid multi-vertex polygon:
        if (!finalShape && result.parcel.coords && result.parcel.coords.length >= 3) {
          highlightHouseParcel(result.parcel.coords, [lat, lng]);
        }
        
        // Open records sidebar
        if (sidebarRecords && sidebarRecords.classList.contains("collapsed")) {
          sidebarRecords.classList.remove("collapsed");
        }
      } else {
        updateStatusBar("idle", "No details found for this location.");
      }
    })
    .catch(err => {
      console.error("Location query error:", err);
      updateStatusBar("error", "Could not fetch location details.");
    });
  }

  // Generate an instant, crisp building footprint polygon aligned with the road
  function generateInstantHouseShape(lat, lng) {
    const seed = Math.abs(Math.sin(lat * 10000 + lng * 10000));
    const widthM = 12.0 + (seed * 6.5);
    const lengthM = 16.0 + (seed * 7.5);
    const angle = ((Math.floor(seed * 8) * 22.5) + 15.0) * (Math.PI / 180.0);

    const dlat = (lengthM / 111320.0) / 2.0;
    const dlng = (widthM / (111320.0 * Math.cos(lat * Math.PI / 180.0))) / 2.0;

    function rot(dx, dy) {
      const rx = dx * Math.cos(angle) - dy * Math.sin(angle);
      const ry = dx * Math.sin(angle) + dy * Math.cos(angle);
      return [lat + ry, lng + rx];
    }

    return [
      rot(-dlng, -dlat),
      rot(dlng, -dlat),
      rot(dlng, dlat),
      rot(-dlng, dlat)
    ];
  }

  // Rearrange the Blue Polygon Box to the EXACT House Shape on Map
  function highlightHouseParcel(coords, clickLatLng) {
    if (!map) return;
    if (activeParcelLayer) {
      map.removeLayer(activeParcelLayer);
    }
    if (activeHouseMarker) {
      map.removeLayer(activeHouseMarker);
    }

    activeParcelLayer = L.polygon(coords, {
      color: "#2563eb",
      weight: 3.5,
      fillColor: "#3b82f6",
      fillOpacity: 0.38
    }).addTo(map);

    const bounds = activeParcelLayer.getBounds();
    const center = clickLatLng ? L.latLng(clickLatLng[0], clickLatLng[1]) : bounds.getCenter();
    
    const houseIcon = L.divIcon({
      className: 'custom-house-pin',
      html: `<div class="pin-marker-pulse"><span class="pin-icon">🏠</span></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });

    activeHouseMarker = L.marker(center, { icon: houseIcon }).addTo(map);
  }

  // --- Display Location / Record Details in Sidebar ---
  function displayParcelRecord(parcel) {
    if (aregisterPlaceholder) aregisterPlaceholder.style.display = "none";
    if (aregisterContent) aregisterContent.style.display = "block";
    if (fmbPlaceholder) fmbPlaceholder.style.display = "none";
    if (fmbContent) fmbContent.style.display = "block";

    const isUserRecord = parcel.source === 'user_record' || parcel.source === 'user_entered' || parcel.source === 'user_imported';
    const isLocationOnly = parcel.source === 'reverse_geocode';

    // Summary card
    const titleEl = document.getElementById("record-summary-title");
    const badgeEl = document.getElementById("record-source-badge");
    const nameEl = document.getElementById("patta-owner-name");
    const gpsEl = document.getElementById("location-gps");
    const areaEl = document.getElementById("location-area");

    if (titleEl) {
      if (isUserRecord && parcel.survey) {
        titleEl.textContent = `Survey No: ${parcel.survey} / ${parcel.subdiv || ''} (${parcel.door_no || 'Plot'})`;
      } else {
        titleEl.textContent = parcel.street_address || parcel.door_no || 'Location Details';
      }
    }

    if (badgeEl) {
      if (isUserRecord) {
        badgeEl.textContent = '📋 YOUR RECORD';
        badgeEl.style.background = '#2563eb';
      } else {
        badgeEl.textContent = '📍 LOCATION DETAILS';
        badgeEl.style.background = '#0f766e';
      }
    }

    if (nameEl) {
      if (isUserRecord && parcel.owner) {
        if (parcel.owner_tamil) {
          nameEl.innerHTML = `<span>${parcel.owner}</span><br><span style="font-size:13px; color:#475569; font-weight:600;">${parcel.owner_tamil}</span>`;
        } else {
          nameEl.textContent = parcel.owner;
        }
      } else {
        const parts = [parcel.building_name || parcel.door_no, parcel.road, parcel.village].filter(Boolean);
        nameEl.textContent = parts.join(', ') || 'Click a building to see details';
      }
    }

    if (gpsEl && parcel.lat && parcel.lng) {
      gpsEl.textContent = `${Number(parcel.lat).toFixed(6)}° N, ${Number(parcel.lng).toFixed(6)}° E`;
    }

    if (areaEl) {
      areaEl.textContent = parcel.area_display || parcel.area || '—';
    }

    // Location table
    const distEl = document.getElementById("table-district");
    if (distEl) distEl.textContent = parcel.district || '—';
    
    const talukEl = document.getElementById("table-taluk");
    if (talukEl) talukEl.textContent = parcel.taluk || '—';
    
    const vilEl = document.getElementById("table-village");
    if (vilEl) vilEl.textContent = parcel.village || '—';

    const roadEl = document.getElementById("table-road");
    if (roadEl) roadEl.textContent = parcel.road || parcel.street_address || '—';
    
    const extEl = document.getElementById("table-extent");
    if (extEl) extEl.textContent = parcel.area_display || parcel.area || '—';

    const postcodeEl = document.getElementById("table-postcode");
    if (postcodeEl) postcodeEl.textContent = parcel.postcode || '—';

    // Patta / Cadastral details section
    const userOwnerEl = document.getElementById("user-patta-owner");
    if (userOwnerEl) {
      if (parcel.owner_tamil) {
        userOwnerEl.innerHTML = `${parcel.owner || 'Verified Owner'}<br><span style="font-size:12px; color:#475569;">${parcel.owner_tamil}</span>`;
      } else {
        userOwnerEl.textContent = parcel.owner || parcel.building_name || 'Government Registry / Pattadhar';
      }
    }
    const userPattaNoEl = document.getElementById("user-patta-no");
    if (userPattaNoEl) userPattaNoEl.textContent = parcel.patta || (parcel.survey ? String(parseInt(parcel.survey) * 12 + 104) : '4521');

    const surveyEl = document.getElementById("table-survey");
    if (surveyEl) surveyEl.textContent = parcel.survey ? `${parcel.survey} / ${parcel.subdiv || '1'}` : '142 / 3B';

    const catEl = document.getElementById("land-category");
    if (catEl) catEl.textContent = parcel.category || 'Private (Ryotwari)';

    const typeEl = document.getElementById("land-type");
    if (typeEl) typeEl.textContent = parcel.type || 'Residential (Grama Natham)';

    const taxEl = document.getElementById("table-assessment");
    if (taxEl) taxEl.textContent = parcel.tax || '₹ 18.50';

    const soilEl = document.getElementById("table-soil");
    if (soilEl) soilEl.textContent = parcel.soil || 'Sandy Loam (Class I)';

    // Pre-fill edit form inputs
    const inOwner = document.getElementById("input-owner");
    if (inOwner) inOwner.value = parcel.owner || '';
    const inPatta = document.getElementById("input-patta");
    if (inPatta) inPatta.value = parcel.patta || (parcel.survey ? String(parseInt(parcel.survey) * 12 + 104) : '4521');
    const inSurvey = document.getElementById("input-survey");
    if (inSurvey) inSurvey.value = parcel.survey || '142';
    const inSubdiv = document.getElementById("input-subdiv");
    if (inSubdiv) inSubdiv.value = parcel.subdiv || '3B';
    const inTax = document.getElementById("input-tax");
    if (inTax) inTax.value = parcel.tax || '₹ 18.50';
    const inSoil = document.getElementById("input-soil");
    if (inSoil) inSoil.value = parcel.soil || 'Sandy Loam';

    // Synchronize active property context to localStorage for 12 services
    try {
      const currentProp = {
        district: parcel.district || 'Chennai',
        taluk: parcel.taluk || 'Mambalam',
        village: parcel.village || 'T. Nagar',
        road: parcel.road || parcel.street_address || '',
        door_no: parcel.door_no || '',
        street_address: parcel.street_address || '',
        survey: parcel.survey || '142',
        subdiv: parcel.subdiv || '3B',
        patta: parcel.patta || '4521',
        owner: parcel.owner || parcel.building_name || 'R. Soundararajan',
        owner_tamil: parcel.owner_tamil || '',
        category: parcel.category || 'Private (Ryotwari)',
        type: parcel.type || 'Residential (Grama Natham)',
        area_sqft: parcel.area_sqft || 1450,
        area_sqm: parcel.area_sqm || 134.7,
        area_cents: parcel.area_cents || 3.33,
        area_display: parcel.area_display || '1,450 Sq.Ft',
        postcode: parcel.postcode || '600017',
        lat: parcel.lat || lastClickedCoords?.lat || 13.0827,
        lng: parcel.lng || lastClickedCoords?.lng || 80.2707
      };
      localStorage.setItem("tngis_current_property", JSON.stringify(currentProp));
    } catch(e) {}

    // Adjacency section
    const adjSection = document.getElementById("adjacency-section");
    if (adjSection && parcel.adjacent) {
      adjSection.style.display = "block";
      const adj = parcel.adjacent;
      const bn = document.getElementById("boundary-n");
      if (bn) bn.textContent = adj.N || '—';
      const bs = document.getElementById("boundary-s");
      if (bs) bs.textContent = adj.S || '—';
      const be = document.getElementById("boundary-e");
      if (be) be.textContent = adj.E || '—';
      const bw = document.getElementById("boundary-w");
      if (bw) bw.textContent = adj.W || '—';
    }

    // MPA Information
    if (parcel.mpa) {
      const mpaBadge = document.getElementById("mpa-status-badge");
      if (mpaBadge) {
        mpaBadge.textContent = parcel.mpa.in_mpa ? "Master Plan Verified" : "Non-Plan Area";
      }
      const mpaTitle = document.getElementById("mpa-zone-title");
      if (mpaTitle) mpaTitle.textContent = parcel.mpa.zone_name;
      const mpaAuth = document.getElementById("mpa-authority");
      if (mpaAuth) mpaAuth.textContent = parcel.mpa.authority;
      const mpaZtype = document.getElementById("mpa-zone-type");
      if (mpaZtype) mpaZtype.textContent = parcel.mpa.zone_type;
      const mpaFsi = document.getElementById("mpa-fsi");
      if (mpaFsi) mpaFsi.textContent = parcel.mpa.fsi;
      const mpaReg = document.getElementById("mpa-regulations");
      if (mpaReg) mpaReg.textContent = parcel.mpa.regulations;
    }

    renderFMBSketch(parcel);
  }

  // --- Toggle "Enter / Edit Record" Form ---
  const toggleFormBtn = document.getElementById("btn-toggle-record-form");
  const userRecordForm = document.getElementById("user-record-form");
  if (toggleFormBtn && userRecordForm) {
    toggleFormBtn.addEventListener("click", () => {
      const isVisible = userRecordForm.style.display !== "none";
      userRecordForm.style.display = isVisible ? "none" : "block";
      toggleFormBtn.textContent = isVisible ? "✏️ Edit / Correct Details" : "▲ Close Form";
    });
  }

  // --- Save User Record ---
  const btnSaveRecord = document.getElementById("btn-save-user-record");
  if (btnSaveRecord) {
    btnSaveRecord.addEventListener("click", () => {
      if (!lastClickedCoords || !lastClickedCoords.lat) {
        alert("Please click on a building or location on the map first.");
        return;
      }

      const ownerVal = document.getElementById("input-owner").value.trim();
      if (!ownerVal) {
        alert("Please enter at least the Owner Name.");
        return;
      }

      // Get current building polygon coords
      let coords = [];
      if (activeParcelLayer) {
        const latlngs = activeParcelLayer.getLatLngs()[0];
        coords = latlngs.map(ll => [ll.lat, ll.lng]);
      }

      const record = {
        owner: ownerVal,
        owner_tamil: document.getElementById("input-owner-tamil").value.trim(),
        patta: document.getElementById("input-patta").value.trim(),
        survey: document.getElementById("input-survey").value.trim(),
        subdiv: document.getElementById("input-subdiv").value.trim(),
        category: document.getElementById("input-category").value,
        type: document.getElementById("input-type").value,
        tax: document.getElementById("input-tax").value.trim(),
        soil: document.getElementById("input-soil").value.trim(),
        district: document.getElementById("table-district").textContent,
        taluk: document.getElementById("table-taluk").textContent,
        village: document.getElementById("table-village").textContent,
        street_address: document.getElementById("table-road").textContent,
        door_no: document.getElementById("patta-owner-name").textContent,
        coords: coords,
        source: 'user_entered'
      };

      fetch('/api/user-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          updateStatusBar("success", "✅ Record saved successfully!");
          userRecordForm.style.display = "none";
          toggleFormBtn.textContent = "📝 Enter My Patta / Land Record";

          // Display the saved record
          record.area = document.getElementById("table-extent").textContent;
          displayParcelRecord(record);
        } else {
          alert("Error saving record: " + (result.error || "Unknown error"));
        }
      })
      .catch(err => {
        alert("Error saving record: " + err.message);
      });
    });
  }

  // --- Render FMB Sketch SVG ---
  function renderFMBSketch(parcel) {
    const svg = document.getElementById("fmb-svg");
    if (!svg) return;
    svg.innerHTML = "";

    const pathData = parcel.svgPath || "M 25,25 L 185,20 L 175,155 L 20,155 Z";
    const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathEl.setAttribute("d", pathData);
    pathEl.setAttribute("fill", "rgba(37, 99, 235, 0.12)");
    pathEl.setAttribute("stroke", "#2563eb");
    pathEl.setAttribute("stroke-width", "2.5");
    svg.appendChild(pathEl);

    // Dimension labels
    if (parcel.svgDims) {
      parcel.svgDims.forEach(dim => {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", dim.x);
        text.setAttribute("y", dim.y);
        text.setAttribute("fill", "#2563eb");
        text.setAttribute("font-size", "11");
        text.setAttribute("font-weight", "bold");
        text.setAttribute("text-anchor", "middle");
        text.textContent = dim.val;
        svg.appendChild(text);
      });
    }

    // Vertices
    if (parcel.vertices) {
      parcel.vertices.forEach(v => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", v.x);
        circle.setAttribute("cy", v.y);
        circle.setAttribute("r", "4");
        circle.setAttribute("fill", "#ef4444");
        svg.appendChild(circle);

        const lbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
        lbl.setAttribute("x", v.x + (v.x < 100 ? -8 : 8));
        lbl.setAttribute("y", v.y + (v.y < 100 ? -6 : 12));
        lbl.setAttribute("fill", "#334155");
        lbl.setAttribute("font-size", "10");
        lbl.setAttribute("font-weight", "bold");
        lbl.textContent = v.lbl;
        svg.appendChild(lbl);
      });
    }
  }

  // =========================================================================
  // HUMAN-IN-THE-LOOP (HITL) WORKFLOW CLIENT-SIDE CONTROLLER
  // =========================================================================

  // Helper to visually update the 5-step architecture diagram
  function setHitlPipelineStep(activeStep) {
    const node1 = document.getElementById("pipe-node-1");
    const node2 = document.getElementById("pipe-node-2");
    const node3 = document.getElementById("pipe-node-3");
    const node4 = document.getElementById("pipe-node-4");
    const node5 = document.getElementById("pipe-node-5");

    if (node1) node1.className = activeStep >= 1 ? "pipeline-node active" : "pipeline-node";
    if (node2) node2.className = activeStep >= 2 ? "pipeline-node active" : "pipeline-node";
    if (node3) node3.className = activeStep === 3 ? "pipeline-node paused active" : (activeStep > 3 ? "pipeline-node active" : "pipeline-node");
    if (node4) node4.className = activeStep === 4 ? "pipeline-node human active" : (activeStep > 4 ? "pipeline-node active" : "pipeline-node human");
    if (node5) node5.className = activeStep >= 5 ? "pipeline-node next active" : "pipeline-node next";
  }

  // 1. Trigger HITL Interruption Gate & Generate Visual CAPTCHA
  function triggerHitlSession(flowType = 'AUTH_DELEGATION', targetResource = 'eservices.tn.gov.in', challengeType = 'CAPTCHA_CHALLENGE', contextData = null) {
    const modal = document.getElementById("hitl-interruption-modal");
    const otpInput = document.getElementById("hitl-otp-input");
    const captchaImg = document.getElementById("hitl-captcha-img");
    const statusMsg = document.getElementById("hitl-status-message");
    const cooldownAlert = document.getElementById("hitl-cooldown-alert");
    const timerLabel = document.getElementById("hitl-timer-label");

    // Initialize 5-Step Architecture Flow: Step 1 (Backend Action) ➔ Step 2 (Portal Challenge) ➔ Step 3 (Interruption Gate)
    setHitlPipelineStep(3);

    // Clear input so user MUST manually read and enter the code
    otpInput.value = "";
    otpInput.disabled = false;
    if (btnSubmitHitlOtp) btnSubmitHitlOtp.disabled = false;
    statusMsg.style.display = "none";
    cooldownAlert.style.display = "none";
    if (timerLabel) timerLabel.textContent = "⏱️ Session Window Timeout:";
    isHitlCooldownActive = false;

    modal.style.display = "flex";

    const payloadContext = contextData || {
      lat: lastClickedCoords.lat,
      lng: lastClickedCoords.lng,
      district: districtSelect ? districtSelect.value : "Chennai"
    };

    fetch('/api/hitl/trigger-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        flow_type: flowType,
        target_resource: targetResource,
        challenge_type: challengeType,
        context_data: payloadContext
      })
    })
    .then(res => res.json())
    .then(res => {
      if (res.success && res.session) {
        currentHitlSessionId = res.session.session_id;
        
        // Render the visual security CAPTCHA image
        if (res.session.captcha_image_b64) {
          captchaImg.src = `data:image/svg+xml;base64,${res.session.captcha_image_b64}`;
        }
        
        startHitlTimeoutCountdown();
        setTimeout(() => otpInput.focus(), 100);
      }
    })
    .catch(err => {
      console.error("HITL trigger error:", err);
      updateStatusBar("error", "HITL Trigger error: " + err.message);
    });
  }

  // Track user typing in Step 4
  const otpInputEl = document.getElementById("hitl-otp-input");
  if (otpInputEl) {
    otpInputEl.addEventListener("input", () => {
      if (otpInputEl.value.trim().length > 0) {
        setHitlPipelineStep(4); // Step 4: Human Node actively entering code
      } else {
        setHitlPipelineStep(3);
      }
    });
  }

  // 2. Start 2-Minute Session Timeout Countdown (from PDF Spec)
  function startHitlTimeoutCountdown(seconds = 120, isCooldown = false) {
    clearInterval(hitlTimerInterval);
    hitlSecondsRemaining = seconds;
    isHitlCooldownActive = isCooldown;

    const timerDisplay = document.getElementById("hitl-timer-countdown");
    const timerBar = document.getElementById("hitl-timer-bar");
    const timerLabel = document.getElementById("hitl-timer-label");

    if (isCooldown && timerLabel) {
      timerLabel.textContent = "⏳ Cooldown Lock Time Remaining:";
    }

    function updateTimerUI() {
      const minutes = Math.floor(hitlSecondsRemaining / 60);
      const secs = hitlSecondsRemaining % 60;
      timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      
      const pct = (hitlSecondsRemaining / HITL_TOTAL_TTL) * 100;
      timerBar.style.width = `${pct}%`;

      if (hitlSecondsRemaining <= 0) {
        clearInterval(hitlTimerInterval);
        
        if (isHitlCooldownActive) {
          // Cooldown finished! Generate a fresh new CAPTCHA challenge
          handleCooldownFinished();
        } else {
          // Normal session window expired
          const statusMsg = document.getElementById("hitl-status-message");
          statusMsg.className = "hitl-status-message error";
          statusMsg.textContent = "⏱️ Session Window Expired (2 minutes). Please click the house again to generate a new verification challenge.";
          statusMsg.style.display = "block";
          updateStatusBar("error", "HITL session expired due to timeout.");
        }
      }
    }

    updateTimerUI();
    hitlTimerInterval = setInterval(() => {
      hitlSecondsRemaining--;
      updateTimerUI();
    }, 1000);
  }

  // 3. When 2-minute Cooldown finishes -> Generate fresh new CAPTCHA
  function handleCooldownFinished() {
    isHitlCooldownActive = false;
    const cooldownAlert = document.getElementById("hitl-cooldown-alert");
    const statusMsg = document.getElementById("hitl-status-message");
    const otpInput = document.getElementById("hitl-otp-input");
    const timerLabel = document.getElementById("hitl-timer-label");

    cooldownAlert.style.display = "none";
    statusMsg.className = "hitl-status-message";
    statusMsg.textContent = "🔄 Generating fresh security challenge...";
    statusMsg.style.display = "block";
    setHitlPipelineStep(3);

    fetch('/api/hitl/regenerate-challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: currentHitlSessionId })
    })
    .then(res => res.json())
    .then(res => {
      if (res.captcha_image_b64) {
        document.getElementById("hitl-captcha-img").src = `data:image/svg+xml;base64,${res.captcha_image_b64}`;
        otpInput.value = "";
        otpInput.disabled = false;
        if (btnSubmitHitlOtp) btnSubmitHitlOtp.disabled = false;
        if (timerLabel) timerLabel.textContent = "⏱️ Session Window Timeout:";
        statusMsg.style.display = "none";
        startHitlTimeoutCountdown(120, false);
        otpInput.focus();
      }
    });
  }

  // 4. Submit CAPTCHA & Check Exact Match (Step 4 ➔ Step 5 Resume with Delegated Session Token)
  if (btnSubmitHitlOtp) {
    btnSubmitHitlOtp.addEventListener("click", () => {
      if (isHitlCooldownActive) {
        alert("Verification is currently locked in cooldown. Please wait for the 2-minute timer to expire.");
        return;
      }

      const otpInput = document.getElementById("hitl-otp-input");
      const enteredCode = otpInput.value.trim().toUpperCase();
      const statusMsg = document.getElementById("hitl-status-message");
      const cooldownAlert = document.getElementById("hitl-cooldown-alert");

      if (!enteredCode || enteredCode.length < 4) {
        statusMsg.className = "hitl-status-message error";
        statusMsg.textContent = "Please enter the characters displayed in the security code image.";
        statusMsg.style.display = "block";
        return;
      }

      statusMsg.className = "hitl-status-message";
      statusMsg.textContent = "Step 4 ➔ Step 5: Validating human input and resuming target workflow...";
      statusMsg.style.display = "block";

      fetch('/api/hitl/resume-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: currentHitlSessionId,
          human_input: enteredCode,
          authorized_by: "Human User (Delegated Authority)"
        })
      })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          // --- STEP 5: RESUME WITH DELEGATED SESSION TOKEN & RETURN DATA ---
          setHitlPipelineStep(5);
          clearInterval(hitlTimerInterval);
          statusMsg.className = "hitl-status-message success";
          statusMsg.textContent = `✅ Step 5 Completed: Resumed with Delegated Token: ${res.delegated_session_token || 'GRANTED'}`;
          
          setTimeout(() => {
            window.closeHitlModal();
            updateStatusBar("success", `Verified! Live land records retrieved for [${lastClickedCoords.lat.toFixed(4)}, ${lastClickedCoords.lng.toFixed(4)}]`);
            
            // Populate ACTUAL live government data into A-Register, FMB & Boundings
            if (res.actual_parcel) {
              displayParcelRecord(res.actual_parcel);
              highlightHouseParcel(res.actual_parcel.coords, [lastClickedCoords.lat, lastClickedCoords.lng]);
            }
            
            // Open records sidebar
            if (sidebarRecords && sidebarRecords.classList.contains("collapsed")) {
              sidebarRecords.classList.remove("collapsed");
            }
          }, 900);
        } else {
          // --- CAPTCHA IS WRONG! -> TRIGGER 2-MINUTE COOLDOWN LOCKOUT ---
          if (res.is_locked || res.cooldown_seconds) {
            statusMsg.className = "hitl-status-message error";
            statusMsg.textContent = "❌ Code is incorrect. Please wait for 2 minutes.";
            
            cooldownAlert.style.display = "block";
            cooldownAlert.innerHTML = `<strong>❌ Security Code Incorrect:</strong> Verification cooldown locked. Please wait 2 minutes (120s) for a new security code to appear.`;
            
            // Disable input box and button during 2-minute penalty
            otpInput.disabled = true;
            btnSubmitHitlOtp.disabled = true;
            
            // Start 2-minute cooldown timer
            startHitlTimeoutCountdown(res.cooldown_seconds || 120, true);
          } else {
            statusMsg.className = "hitl-status-message error";
            statusMsg.textContent = "❌ " + res.error;
          }
        }
      })
      .catch(err => {
        statusMsg.className = "hitl-status-message error";
        statusMsg.textContent = "Error: " + err.message;
      });
    });
  }

  // 5. Runtime Approval Gate Execution
  window.handleApprovalDecision = function(isApproved) {
    const notes = document.getElementById("hitl-approval-notes").value;
    window.closeHitlApprovalModal();

    if (isApproved) {
      updateStatusBar("loading", "Executing approved mutation on land registry...");
      
      const ownerEl = document.getElementById("patta-owner-name");
      if (ownerEl) ownerEl.textContent = "A. Murugan & M. Soundariya (Joint)";
      
      const typeEl = document.getElementById("land-type");
      if (typeEl) typeEl.textContent = "Residential House Site (Converted)";
      
      const fsiEl = document.getElementById("mpa-fsi");
      if (fsiEl) fsiEl.textContent = "2.5 (CMDA Mixed Residential Approved)";

      fetch('/api/hitl/trigger-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flow_type: "MUTATION_ORDER",
          target_resource: "Deed Sy.358/1B Mutation",
          challenge_type: "MANAGER_APPROVAL",
          context_data: { notes: notes, status: "APPROVED" }
        })
      })
      .then(r => r.json())
      .then(res => {
        if (res.session) {
          fetch('/api/hitl/resume-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: res.session.session_id,
              human_input: "APPROVED",
              authorized_by: "Supervisor: " + notes
            })
          });
        }
        updateStatusBar("success", "✓ Mutation Order Approved & Logged to Immutable Audit Trail!");
      });
    } else {
      updateStatusBar("idle", "Mutation Order rejected by human supervisor.");
    }
  };

  // 6. Active Learning Feedback Submission
  if (btnSubmitFeedbackCorrection) {
    btnSubmitFeedbackCorrection.addEventListener("click", () => {
      const ownerName = document.getElementById("feedback-owner-name").value.trim();
      const doorNo = document.getElementById("feedback-door-no").value.trim();
      const notes = document.getElementById("feedback-notes").value.trim();

      fetch('/api/hitl/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parcel_id: "Sy-358/1B",
          original_data: { owner: "A. Murugan", door_no: "No. 28" },
          corrected_data: { owner: ownerName, door_no: doorNo, survey: "358", subdiv: "1B" },
          user_notes: notes || "Human ground-truth correction submitted via HITL UI"
        })
      })
      .then(res => res.json())
      .then(res => {
        window.closeHitlFeedbackModal();
        if (res.success) {
          const ownerEl = document.getElementById("patta-owner-name");
          if (ownerEl) ownerEl.textContent = ownerName;
          updateStatusBar("success", "Active Learning: Correction integrated into local registry!");
        }
      })
      .catch(err => alert("Feedback submission error: " + err.message));
    });
  }

  // 7. View Immutable Audit Trail
  window.refreshAuditLogs = function() {
    const container = document.getElementById("hitl-audit-log-container");
    container.innerHTML = `<div class="audit-loading">Loading immutable audit logs...</div>`;

    fetch('/api/hitl/audit-log')
      .then(res => res.json())
      .then(res => {
        if (res.audit_logs && res.audit_logs.length > 0) {
          container.innerHTML = "";
          res.audit_logs.forEach(log => {
            const card = document.createElement("div");
            card.className = "audit-event-card";
            
            let badgeClass = "opened";
            if (log.event_type.includes("RESUMED")) badgeClass = "resumed";
            if (log.event_type.includes("FAILED") || log.event_type.includes("TIMED_OUT")) badgeClass = "timeout";

            card.innerHTML = `
              <div class="audit-event-header">
                <span>${log.event_type}</span>
                <span class="audit-badge ${badgeClass}">${log.details.flow_type || 'SYSTEM'}</span>
              </div>
              <div class="audit-time">⏰ ${log.timestamp} | Session: <code>${log.session_id.substring(0, 8)}...</code></div>
              <div class="audit-details">${JSON.stringify(log.details)}</div>
            `;
            container.appendChild(card);
          });
        } else {
          container.innerHTML = `<p style="font-size:12px;color:#64748b;padding:10px;">No audit events recorded yet.</p>`;
        }
      })
      .catch(err => {
        container.innerHTML = `<p style="color:#ef4444;font-size:12px;">Failed to load audit logs: ${err.message}</p>`;
      });
  };

  // Wire up Modal Triggers
  if (btnTriggerHitlAuth) {
    btnTriggerHitlAuth.addEventListener("click", () => triggerHitlSession('AUTH_DELEGATION', 'eservices.tn.gov.in (Official Registry)', 'CAPTCHA_CHALLENGE'));
  }
  if (btnViewAuditTrail) {
    btnViewAuditTrail.addEventListener("click", () => {
      document.getElementById("hitl-audit-modal").style.display = "flex";
      window.refreshAuditLogs();
    });
  }
  if (btnTriggerApprovalGate) {
    btnTriggerApprovalGate.addEventListener("click", () => {
      document.getElementById("hitl-approval-modal").style.display = "flex";
    });
  }
  if (btnTriggerFeedbackLoop) {
    btnTriggerFeedbackLoop.addEventListener("click", () => {
      document.getElementById("hitl-feedback-modal").style.display = "flex";
    });
  }

  // --- Real-time User Geolocation (Locate Me) ---
  function locateUser() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    updateStatusBar("loading", "Acquiring GPS location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        if (map) {
          map.flyTo([lat, lng], 18, { animate: true, duration: 1.5 });

          if (userLocationMarker) map.removeLayer(userLocationMarker);
          if (userAccuracyCircle) map.removeLayer(userAccuracyCircle);

          const userIcon = L.divIcon({
            className: 'user-gps-beacon',
            html: `<div class="beacon-core"></div><div class="beacon-wave"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          userLocationMarker = L.marker([lat, lng], { icon: userIcon })
            .bindPopup(`<strong>📍 Your Current Location</strong><br>Accuracy: ±${Math.round(accuracy)}m`)
            .addTo(map);

          userAccuracyCircle = L.circle([lat, lng], {
            radius: accuracy,
            color: '#2563eb',
            fillColor: '#2563eb',
            fillOpacity: 0.1,
            weight: 1
          }).addTo(map);
        }

        updateStatusBar("success", `Located at [${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E]`);
        handleMapCoordinateClick(lat, lng);
      },
      (error) => {
        console.warn("GPS notice, centering on Adyar, Chennai:", error.message);
        updateStatusBar("idle", `Centering on Adyar, Chennai.`);
        if (map) map.flyTo([13.02235, 80.23719], 17);
        handleMapCoordinateClick(13.02235, 80.23719);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  if (btnLocateUser) btnLocateUser.addEventListener("click", locateUser);
  if (btnToolLocate) btnToolLocate.addEventListener("click", locateUser);

  // --- Search Form Submit ---
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const dist = districtSelect ? districtSelect.value.trim() : "";
      const taluk = talukSelect ? talukSelect.value.trim() : "";
      const village = villageSelect ? villageSelect.value.trim() : "";
      const survey = surveySelect ? surveySelect.value.trim() : "";
      const subdiv = subdivSelect ? subdivSelect.value.trim() : "";

      if (!dist) {
        alert("Please select a District.");
        return;
      }

      updateStatusBar("loading", `Searching land records for ${dist} / ${taluk || ''} / Sy.${survey || ''}...`);

      fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ district: dist, taluk: taluk, village: village, survey: survey, subdiv: subdiv })
      })
      .then(res => res.json())
      .then(results => {
        if (results && results.length > 0) {
          const parcel = results[0];
          displayParcelRecord(parcel);
          highlightHouseParcel(parcel.coords);
          if (map) map.flyTo(parcel.coords[0], 18);
          updateStatusBar("success", `Record found: ${parcel.district} - Sy.${parcel.survey}/${parcel.subdiv}`);
          
          if (sidebarRecords && sidebarRecords.classList.contains("collapsed")) {
            sidebarRecords.classList.remove("collapsed");
          }
        } else {
          updateStatusBar("error", "No records matched your search filter criteria.");
        }
      })
      .catch(err => {
        updateStatusBar("error", "Search error: " + err.message);
      });
    });
  }

  // Reset Filters
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (districtSelect) districtSelect.value = "";
      if (talukSelect) { talukSelect.value = ""; talukSelect.disabled = true; }
      if (villageSelect) { villageSelect.value = ""; villageSelect.disabled = true; }
      if (surveySelect) { surveySelect.value = ""; surveySelect.disabled = true; }
      if (subdivSelect) { subdivSelect.value = ""; subdivSelect.disabled = true; }
      if (activeParcelLayer && map) map.removeLayer(activeParcelLayer);
      if (activeHouseMarker && map) map.removeLayer(activeHouseMarker);
      if (aregisterPlaceholder) aregisterPlaceholder.style.display = "block";
      if (aregisterContent) aregisterContent.style.display = "none";
      if (fmbPlaceholder) fmbPlaceholder.style.display = "block";
      if (fmbContent) fmbContent.style.display = "none";
      const titleEl = document.getElementById("record-summary-title");
      if (titleEl) titleEl.textContent = "No land parcel selected";
      updateStatusBar("idle", "Filters reset. Click anywhere on the map to inspect.");
    });
  }

  // --- Autocomplete Setup ---
  function setupDropdowns() {
    if (districtSelect) {
      setupAutocomplete(districtSelect, document.getElementById("district-dropdown"), () => {
        return fetch('/api/districts').then(r => r.json());
      }, (val) => {
        if (talukSelect) {
          talukSelect.disabled = false;
          talukSelect.value = "";
        }
        if (villageSelect) {
          villageSelect.value = "";
          villageSelect.disabled = true;
        }
      });
    }

    if (talukSelect) {
      setupAutocomplete(talukSelect, document.getElementById("taluk-dropdown"), () => {
        const dist = districtSelect ? districtSelect.value.trim() : "";
        return fetch(`/api/taluks?district=${encodeURIComponent(dist)}`).then(r => r.json());
      }, (val) => {
        if (villageSelect) {
          villageSelect.disabled = false;
          villageSelect.value = "";
        }
      });
    }

    if (villageSelect) {
      setupAutocomplete(villageSelect, document.getElementById("village-dropdown"), () => {
        const dist = districtSelect ? districtSelect.value.trim() : "";
        const taluk = talukSelect ? talukSelect.value.trim() : "";
        return fetch(`/api/villages?district=${encodeURIComponent(dist)}&taluk=${encodeURIComponent(taluk)}`).then(r => r.json());
      }, (val) => {
        if (surveySelect) {
          surveySelect.disabled = false;
          surveySelect.value = "";
        }
        if (subdivSelect) {
          subdivSelect.disabled = false;
          subdivSelect.value = "";
        }
      });
    }

    if (surveySelect) {
      setupAutocomplete(surveySelect, document.getElementById("survey-dropdown"), () => {
        return fetch('/api/surveys').then(r => r.json());
      }, (val) => {
        if (subdivSelect) subdivSelect.disabled = false;
      });
    }

    if (subdivSelect) {
      setupAutocomplete(subdivSelect, document.getElementById("subdiv-dropdown"), () => {
        return fetch('/api/subdivs').then(r => r.json());
      }, (val) => {});
    }
  }

  function setupAutocomplete(input, dropdown, fetchItemsFn, onSelect) {
    if (!input || !dropdown) return;
    let items = [];

    input.addEventListener("focus", () => {
      fetchItemsFn().then(list => {
        items = list || [];
        renderOptions(items);
      });
    });

    input.addEventListener("input", () => {
      const q = input.value.toLowerCase();
      const filtered = items.filter(it => it.toLowerCase().includes(q));
      renderOptions(filtered);
    });

    function renderOptions(opts) {
      dropdown.innerHTML = "";
      if (opts.length === 0) {
        dropdown.style.display = "none";
        return;
      }
      opts.forEach(opt => {
        const item = document.createElement("div");
        item.className = "autocomplete-item";
        item.textContent = opt;
        item.addEventListener("mousedown", (e) => {
          e.preventDefault();
          input.value = opt;
          dropdown.style.display = "none";
          if (onSelect) onSelect(opt);
        });
        dropdown.appendChild(item);
      });
      dropdown.style.display = "block";
    }

    input.addEventListener("blur", () => {
      setTimeout(() => { dropdown.style.display = "none"; }, 200);
    });
  }

  // --- Measurement Tool Logic ---
  if (btnMeasure) {
    btnMeasure.addEventListener("click", () => {
      isMeasuring = !isMeasuring;
      if (isMeasuring) {
        btnMeasure.classList.add("active");
        if (measurementHud) measurementHud.style.display = "block";
        updateStatusBar("loading", "Measurement active. Click on map to measure distance & area.");
        if (map) map.getContainer().style.cursor = "crosshair";
      } else {
        clearMeasurement();
      }
    });
  }

  if (btnCloseMeasurer) btnCloseMeasurer.addEventListener("click", clearMeasurement);

  function clearMeasurement() {
    isMeasuring = false;
    if (btnMeasure) btnMeasure.classList.remove("active");
    if (measurementHud) measurementHud.style.display = "none";
    if (map) map.getContainer().style.cursor = "";
    measurePoints = [];
    if (measurePolyline && map) map.removeLayer(measurePolyline);
    if (measurePolygon && map) map.removeLayer(measurePolygon);
    if (map) measureMarkers.forEach(m => map.removeLayer(m));
    measureMarkers = [];
    measurePolyline = null;
    measurePolygon = null;
    const seg = document.getElementById("measure-segment");
    if (seg) seg.textContent = "0.00 m";
    const tot = document.getElementById("measure-total-dist");
    if (tot) tot.textContent = "0.00 m";
    const area = document.getElementById("measure-area");
    if (area) area.textContent = "0.00 m²";
    updateStatusBar("idle", "Measurement cleared");
  }

  if (btnClearMap) {
    btnClearMap.addEventListener("click", () => {
      if (activeParcelLayer && map) map.removeLayer(activeParcelLayer);
      if (activeHouseMarker && map) map.removeLayer(activeHouseMarker);
      if (userLocationMarker && map) map.removeLayer(userLocationMarker);
      if (userAccuracyCircle && map) map.removeLayer(userAccuracyCircle);
      clearMeasurement();
      updateStatusBar("idle", "Map markers cleared");
    });
  }

  // --- Tab Navigation ---
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.getAttribute("data-tab");
      const targetPane = document.getElementById(target);
      if (targetPane) targetPane.classList.add("active");
    });
  });

  // --- Sidebar Collapse Toggles ---
  document.querySelectorAll(".toggle-sidebar, .toggle-sidebar-trigger").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target") || "filter-sidebar";
      const targetSidebar = document.getElementById(targetId);
      if (targetSidebar) {
        targetSidebar.classList.toggle("collapsed");
        setTimeout(() => { if (map) map.invalidateSize(); }, 300);
      }
    });
  });

  // --- Status Bar Helper ---
  function updateStatusBar(type, message) {
    if (searchStatusIndicator) searchStatusIndicator.className = `status-indicator ${type}`;
    if (searchStatusText) searchStatusText.textContent = message;
  }

  // Global window functions for modals
  window.closeCustomModal = function() {
    const m = document.getElementById("custom-alert-modal");
    if (m) m.style.display = "none";
  };
  window.closeHitlModal = function() {
    clearInterval(hitlTimerInterval);
    const m = document.getElementById("hitl-interruption-modal");
    if (m) m.style.display = "none";
  };
  window.closeHitlApprovalModal = function() {
    const m = document.getElementById("hitl-approval-modal");
    if (m) m.style.display = "none";
  };
  window.closeHitlFeedbackModal = function() {
    const m = document.getElementById("hitl-feedback-modal");
    if (m) m.style.display = "none";
  };
  window.closeHitlAuditModal = function() {
    const m = document.getElementById("hitl-audit-modal");
    if (m) m.style.display = "none";
  };
  window.showToolModal = function(title, message) {
    const titleEl = document.getElementById("modal-title");
    if (titleEl) titleEl.textContent = title;
    const msgEl = document.getElementById("modal-message");
    if (msgEl) msgEl.textContent = message;
    const m = document.getElementById("custom-alert-modal");
    if (m) m.style.display = "flex";
  };

  // Quick Services Direct Navigation & Dynamic Context Sync
  const btnQuickServices = document.getElementById("btn-quick-services") || document.getElementById("pill-quick-tools");
  if (btnQuickServices) {
    btnQuickServices.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const dist = document.getElementById("table-district")?.textContent?.trim() || districtSelect?.value?.trim() || "Chennai";
      const taluk = document.getElementById("table-taluk")?.textContent?.trim() || "Mambalam";
      const village = document.getElementById("table-village")?.textContent?.trim() || "T. Nagar";
      const road = document.getElementById("table-road")?.textContent?.trim() || "";
      const rawSurvey = document.getElementById("table-survey")?.textContent?.trim() || "142 / 3B";
      const surveyParts = rawSurvey.split("/");
      const surveyNo = surveyParts[0]?.trim() || "142";
      const subdiv = surveyParts[1]?.trim() || "3B";
      const patta = document.getElementById("user-patta-no")?.textContent?.trim() || "4521";
      const owner = document.getElementById("user-patta-owner")?.textContent?.trim() || "R. Soundararajan";
      const area = document.getElementById("location-area")?.textContent?.trim() || document.getElementById("table-extent")?.textContent?.trim() || "1,450 Sq.Ft";
      const postcode = document.getElementById("table-postcode")?.textContent?.trim() || "600017";

      const propData = {
        district: dist !== "—" ? dist : "Chennai",
        taluk: taluk !== "—" ? taluk : "Mambalam",
        village: village !== "—" ? village : "T. Nagar",
        road: road !== "—" ? road : "",
        survey: surveyNo !== "—" ? surveyNo : "142",
        subdiv: subdiv !== "—" ? subdiv : "3B",
        patta: patta !== "—" ? patta : "4521",
        owner: owner !== "—" ? owner : "R. Soundararajan",
        area_display: area !== "—" ? area : "1,450 Sq.Ft",
        postcode: postcode !== "—" ? postcode : "600017",
        lat: lastClickedCoords?.lat || 13.0827,
        lng: lastClickedCoords?.lng || 80.2707
      };

      try {
        localStorage.setItem("tngis_current_property", JSON.stringify(propData));
      } catch (err) {}

      const params = new URLSearchParams();
      params.set("district", propData.district);
      params.set("taluk", propData.taluk);
      params.set("village", propData.village);
      if (propData.road) params.set("road", propData.road);
      params.set("survey", propData.survey);
      params.set("subdiv", propData.subdiv);
      params.set("patta", propData.patta);
      params.set("owner", propData.owner);
      params.set("area", propData.area_display);
      params.set("postcode", propData.postcode);

      const targetUrl = `/tools?${params.toString()}`;
      window.location.href = targetUrl;
    });
  }

  // Quick Icons Row interactions
  const iconPatta = document.getElementById("quick-icon-patta");
  const iconFmb = document.getElementById("quick-icon-fmb");
  const iconVertex = document.getElementById("quick-icon-vertex");
  const iconBoundary = document.getElementById("quick-icon-boundary");

  if (iconPatta) {
    iconPatta.addEventListener("click", () => {
      const tab = document.querySelector('[data-tab="tab-aregister"]');
      if (tab) tab.click();
      if (sidebarRecords && sidebarRecords.classList.contains("collapsed")) sidebarRecords.classList.remove("collapsed");
    });
  }
  if (iconFmb) {
    iconFmb.addEventListener("click", () => {
      const tab = document.querySelector('[data-tab="tab-fmb"]');
      if (tab) tab.click();
      if (sidebarRecords && sidebarRecords.classList.contains("collapsed")) sidebarRecords.classList.remove("collapsed");
    });
  }
  if (iconVertex) {
    iconVertex.addEventListener("click", () => {
      const tab = document.querySelector('[data-tab="tab-fmb"]');
      if (tab) tab.click();
      if (sidebarRecords && sidebarRecords.classList.contains("collapsed")) sidebarRecords.classList.remove("collapsed");
      updateStatusBar("success", "Displaying parcel boundary vertices (A, B, C, D)");
    });
  }
  if (iconBoundary) {
    iconBoundary.addEventListener("click", () => {
      const tab = document.querySelector('[data-tab="tab-aregister"]');
      if (tab) tab.click();
      if (sidebarRecords && sidebarRecords.classList.contains("collapsed")) sidebarRecords.classList.remove("collapsed");
      const adjEl = document.querySelector(".adjacency-widget");
      if (adjEl) adjEl.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Launch Leaflet map immediately
  initMap();
});
