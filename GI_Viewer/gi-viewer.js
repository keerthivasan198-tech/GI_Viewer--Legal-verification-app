// --- TNGIS GI Viewer Core Logic ---

document.addEventListener("DOMContentLoaded", () => {
  // --- UI Elements ---
  const form = document.getElementById("gis-search-form");
  const districtSelect = document.getElementById("district-select");
  const talukSelect = document.getElementById("taluk-select");
  const villageSelect = document.getElementById("village-select");
  const typeSelect = document.getElementById("type-select");
  const surveySelect = document.getElementById("survey-select");
  const subdivSelect = document.getElementById("subdiv-select");

  const btnSearch = document.getElementById("btn-search-land");
  const btnReset = document.getElementById("btn-reset-filters");

  const sidebarFilter = document.getElementById("filter-sidebar");
  const sidebarRecords = document.getElementById("records-sidebar");
  const triggerFilter = document.getElementById("trigger-filter");

  const coordsDisplay = document.getElementById("coords-display");
  const searchStatusBar = document.getElementById("search-status-bar");
  const searchStatusIndicator = searchStatusBar.querySelector(".status-indicator");
  const searchStatusText = searchStatusBar.querySelector(".status-text");

  // Tab Pane triggers
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  // Record contents
  const aregisterPlaceholder = document.getElementById("aregister-placeholder");
  const aregisterContent = document.getElementById("aregister-content");
  const fmbPlaceholder = document.getElementById("fmb-placeholder");
  const fmbContent = document.getElementById("fmb-content");

  // Map overlays & HUDs
  const btnMeasure = document.getElementById("btn-tool-measure");
  const btnClearMap = document.getElementById("btn-tool-clear");
  const measurementHud = document.getElementById("measurement-hud");
  const btnCloseMeasurer = document.getElementById("btn-close-measurer");

  const layerStreetsBtn = document.getElementById("layer-streets");
  const layerSatelliteBtn = document.getElementById("layer-satellite");
  const layerDarkBtn = document.getElementById("layer-dark");

  // --- Mock Spatial Database for Tamil Nadu ---
  const mockDatabase = {
    Chennai: {
      center: [13.0330, 80.2690],
      taluks: {
        Egmore: {
          villages: {
            "Egmore Village": {
              parcels: [
                {
                  survey: "101", subdiv: "1A", owner: "R. Kuppusamy", patta: "2304", category: "Private (Ryotwari)", type: "Ryotwari Nanjai (Wet Land)",
                  area: "0 Hectares, 12.4 Ares (0.31 Acres)", tax: "₹ 1.80", soil: "Sandy Loam / Class II",
                  coords: [
                    [13.0335, 80.2685], [13.0338, 80.2692], [13.0332, 80.2695], [13.0329, 80.2688]
                  ],
                  adjacent: { N: "Survey 100", S: "Survey 101/1B", E: "Survey 102", W: "Panchayat Street (6m)" },
                  svgPath: "M 20,40 L 180,20 L 190,160 L 40,180 Z",
                  svgDims: [
                    { x: 100, y: 25, val: "38.5 m" }, { x: 190, y: 90, val: "54.2 m" },
                    { x: 115, y: 175, val: "41.0 m" }, { x: 25, y: 110, val: "51.8 m" }
                  ],
                  vertices: [{ x: 20, y: 40, lbl: "A" }, { x: 180, y: 20, lbl: "B" }, { x: 190, y: 160, lbl: "C" }, { x: 40, y: 180, lbl: "D" }]
                },
                {
                  survey: "101", subdiv: "1B", owner: "S. Meenakshi Sundaram", patta: "2305", category: "Private (Ryotwari)", type: "Ryotwari Punjai (Dry Land)",
                  area: "0 Hectares, 8.2 Ares (0.20 Acres)", tax: "₹ 1.10", soil: "Sandy / Class III",
                  coords: [
                    [13.0329, 80.2688], [13.0332, 80.2695], [13.0327, 80.2698], [13.0324, 80.2691]
                  ],
                  adjacent: { N: "Survey 101/1A", S: "Survey 105", E: "Survey 102", W: "Panchayat Street (6m)" },
                  svgPath: "M 40,30 L 190,10 L 170,160 L 20,150 Z",
                  svgDims: [
                    { x: 115, y: 15, val: "29.4 m" }, { x: 185, y: 85, val: "44.6 m" },
                    { x: 95, y: 160, val: "31.1 m" }, { x: 25, y: 90, val: "42.3 m" }
                  ],
                  vertices: [{ x: 40, y: 30, lbl: "A" }, { x: 190, y: 10, lbl: "B" }, { x: 170, y: 160, lbl: "C" }, { x: 20, y: 150, lbl: "D" }]
                },
                {
                  survey: "102", subdiv: "2", owner: "Tamil Nadu Housing Board (TNHB)", patta: "G-102", category: "Government Poramboke", type: "Tharisu (Waste Land / Public)",
                  area: "0 Hectares, 34.0 Ares (0.84 Acres)", tax: "Exempted", soil: "Graveled / Class V",
                  coords: [
                    [13.0338, 80.2692], [13.0344, 80.2705], [13.0335, 80.2709], [13.0332, 80.2695]
                  ],
                  adjacent: { N: "Survey 99", S: "Survey 103", E: "Survey 107", W: "Survey 101" },
                  svgPath: "M 30,50 L 190,20 L 180,180 L 15,150 Z",
                  svgDims: [
                    { x: 110, y: 30, val: "72.4 m" }, { x: 190, y: 100, val: "48.2 m" },
                    { x: 97, y: 170, val: "71.0 m" }, { x: 18, y: 100, val: "45.6 m" }
                  ],
                  vertices: [{ x: 30, y: 50, lbl: "A" }, { x: 190, y: 20, lbl: "B" }, { x: 180, y: 180, lbl: "C" }, { x: 15, y: 150, lbl: "D" }]
                }
              ]
            }
          }
        },
        Mylapore: {
          villages: {
            "Mylapore Village": {
              parcels: [
                {
                  survey: "104", subdiv: "2B", owner: "K. Ramachandran", patta: "1042", category: "Private (Ryotwari)", type: "Ryotwari Nanjai (Wet Land)",
                  area: "0 Hectares, 25.5 Ares (0.63 Acres)", tax: "₹ 3.50", soil: "Clayey / Class I (Vandol)",
                  coords: [
                    [13.0330, 80.2690], [13.0336, 80.2698], [13.0331, 80.2704], [13.0325, 80.2696]
                  ],
                  adjacent: { N: "Survey 104/1", S: "Survey 105", E: "Survey 104/3", W: "Road - Width 9m" },
                  svgPath: "M 30,40 L 170,25 L 200,165 L 60,180 Z",
                  svgDims: [
                    { x: 100, y: 28, val: "52.4 m" }, { x: 190, y: 95, val: "38.1 m" },
                    { x: 130, y: 180, val: "51.0 m" }, { x: 40, y: 110, val: "39.8 m" }
                  ],
                  vertices: [{ x: 30, y: 40, lbl: "A" }, { x: 170, y: 25, lbl: "B" }, { x: 200, y: 165, lbl: "C" }, { x: 60, y: 180, lbl: "D" }]
                },
                {
                  survey: "105", subdiv: "1", owner: "M. Abdul Rahman & Partners", patta: "893", category: "Private (Ryotwari)", type: "Ryotwari Punjai (Dry Land)",
                  area: "0 Hectares, 18.0 Ares (0.44 Acres)", tax: "₹ 2.40", soil: "Clayey Loam / Class II",
                  coords: [
                    [13.0325, 80.2696], [13.0331, 80.2704], [13.0326, 80.2709], [13.0320, 80.2701]
                  ],
                  adjacent: { N: "Survey 104/2B", S: "Survey 106", E: "Private Land", W: "Public Path" },
                  svgPath: "M 40,40 L 190,30 L 170,170 L 20,140 Z",
                  svgDims: [
                    { x: 115, y: 30, val: "44.1 m" }, { x: 185, y: 100, val: "39.5 m" },
                    { x: 95, y: 160, val: "42.0 m" }, { x: 25, y: 90, val: "37.2 m" }
                  ],
                  vertices: [{ x: 40, y: 40, lbl: "A" }, { x: 190, y: 30, lbl: "B" }, { x: 170, y: 170, lbl: "C" }, { x: 20, y: 140, lbl: "D" }]
                }
              ]
            }
          }
        }
      }
    },
    Madurai: {
      center: [9.9252, 78.1198],
      taluks: {
        "Madurai South": {
          villages: {
            "Thirupparankundram Village": {
              parcels: [
                {
                  survey: "150", subdiv: "1", owner: "R. Ganesan & G. Murugan", patta: "504", category: "Private (Ryotwari)", type: "Ryotwari Nanjai (Wet Land)",
                  area: "0 Hectares, 45.0 Ares (1.11 Acres)", tax: "₹ 5.80", soil: "Black Cotton / Class I",
                  coords: [
                    [9.9252, 78.1198], [9.9258, 78.1205], [9.9251, 78.1210], [9.9245, 78.1203]
                  ],
                  adjacent: { N: "Survey 149", S: "Survey 151", E: "Water Channel (Vaikkal)", W: "NH-45 Highway" },
                  svgPath: "M 20,20 L 180,50 L 160,190 L 40,160 Z",
                  svgDims: [
                    { x: 100, y: 30, val: "88.2 m" }, { x: 175, y: 120, val: "52.4 m" },
                    { x: 100, y: 180, val: "86.0 m" }, { x: 25, y: 90, val: "51.1 m" }
                  ],
                  vertices: [{ x: 20, y: 20, lbl: "A" }, { x: 180, y: 50, lbl: "B" }, { x: 160, y: 190, lbl: "C" }, { x: 40, y: 160, lbl: "D" }]
                }
              ]
            }
          }
        }
      }
    },
    Coimbatore: {
      center: [11.0168, 76.9558],
      taluks: {
        "Coimbatore North": {
          villages: {
            "Tudiyalur Village": {
              parcels: [
                {
                  survey: "205", subdiv: "3A", owner: "V. Lakshmi Prasanna", patta: "9082", category: "Private (Ryotwari)", type: "Ryotwari Punjai (Dry Land)",
                  area: "1 Hectares, 2.0 Ares (2.52 Acres)", tax: "₹ 12.00", soil: "Red Sandy / Class III",
                  coords: [
                    [11.0168, 76.9558], [11.0175, 76.9566], [11.0169, 76.9572], [11.0162, 76.9564]
                  ],
                  adjacent: { N: "Survey 204", S: "Survey 205/3B", E: "Survey 206", W: "Road - Width 12m" },
                  svgPath: "M 30,30 L 190,20 L 180,180 L 20,170 Z",
                  svgDims: [
                    { x: 110, y: 20, val: "105.4 m" }, { x: 190, y: 100, val: "95.2 m" },
                    { x: 100, y: 180, val: "104.0 m" }, { x: 20, y: 100, val: "94.8 m" }
                  ],
                  vertices: [{ x: 30, y: 30, lbl: "A" }, { x: 190, y: 20, lbl: "B" }, { x: 180, y: 180, lbl: "C" }, { x: 20, y: 170, lbl: "D" }]
                }
              ]
            }
          }
        }
      }
    },
    Kanchipuram: {
      center: [12.8387, 79.7016],
      taluks: {
        Sriperumbudur: {
          villages: {
            "Vallam Village": {
              parcels: [
                {
                  survey: "310", subdiv: "4B", owner: "SIPCOT Industrial Corporation", patta: "SIP-310", category: "Government Poramboke", type: "Industrial Use Only",
                  area: "3 Hectares, 50.0 Ares (8.65 Acres)", tax: "Exempted", soil: "Sandy / Class IV",
                  coords: [
                    [12.8387, 79.7016], [12.8398, 79.7028], [12.8390, 79.7036], [12.8379, 79.7024]
                  ],
                  adjacent: { N: "SIPCOT Layout Road", S: "Survey 311", E: "Industrial Block G", W: "Survey 309" },
                  svgPath: "M 15,25 L 185,15 L 195,185 L 25,175 Z",
                  svgDims: [
                    { x: 100, y: 15, val: "220.5 m" }, { x: 195, y: 100, val: "172.4 m" },
                    { x: 110, y: 185, val: "215.0 m" }, { x: 15, y: 100, val: "170.1 m" }
                  ],
                  vertices: [{ x: 15, y: 25, lbl: "A" }, { x: 185, y: 15, lbl: "B" }, { x: 195, y: 185, lbl: "C" }, { x: 25, y: 175, lbl: "D" }]
                }
              ]
            }
          }
        }
      }
    }
  };

  let map;
  let activeParcelLayer = null;
  let allParcelsLayerGroup = null;
  let selectedParcel = null;
  let isServerOnline = false;
  let serverParcels = [];

  // --- Map Initialization ---
  function initMap() {
    // Default centering to Chennai
    const defaultCenter = [13.0330, 80.2690];
    map = L.map("map", {
      zoomControl: true,
      attributionControl: true
    }).setView(defaultCenter, 16);

    // Tile Layers
    const layers = {
      streets: L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 20
      }),
      satellite: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19
      }),
      dark: L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 20
      })
    };

    // TNGIS Boundary Layers (OGC WMS) - Loaded by default
    const wmsLayer = L.tileLayer.wms("https://tngis.tn.gov.in/geoserver/ows", {
      layers: "tngis:district_boundary,tngis:taluk_boundary,tngis:village_boundary",
      format: "image/png",
      transparent: true,
      version: "1.1.1",
      attribution: "TNGIS, Govt of Tamil Nadu",
      maxZoom: 20
    }).addTo(map);

    // Add default streets layer
    layers.streets.addTo(map);

    // Layer Group for all parcels
    allParcelsLayerGroup = L.layerGroup().addTo(map);

    // HUD layer toggles
    layerStreetsBtn.addEventListener("click", () => setActiveBaseLayer("streets", layers));
    layerSatelliteBtn.addEventListener("click", () => setActiveBaseLayer("satellite", layers));
    layerDarkBtn.addEventListener("click", () => setActiveBaseLayer("dark", layers));

    // Track mouse coordinate movement
    map.on("mousemove", (e) => {
      coordsDisplay.textContent = `${e.latlng.lat.toFixed(5)}° N, ${e.latlng.lng.toFixed(5)}° E`;
    });

    // Handle map clicks (Spatial Query identify tool)
    map.on("click", (e) => {
      if (isMeasuring) return;
      const latlng = e.latlng;
      notifyParent({ event: "MAP_CLICKED", data: { lat: latlng.lat, lng: latlng.lng } });
      
      if (isServerOnline) {
        // Query coordinate geometry on Python GIS server
        fetch('http://127.0.0.1:5000/api/query-coords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: latlng.lat, lng: latlng.lng })
        })
        .then(res => res.json())
        .then(data => {
          if (data.found) {
            selectParcelData(data.parcel, data.parcel.district, data.parcel.taluk, data.parcel.village);
          } else {
            // Retrieve actual Tamil Nadu location details dynamically via Flask proxy
            fetchDynamicLocationData(latlng);
          }
        })
        .catch(err => {
          console.error("API coord query error:", err);
          fetchDynamicLocationData(latlng);
        });
      } else {
        // Local offline fallback coordinate check
        if (!localCoordinateQuery(latlng)) {
          alert("Offline fallback active. Please start the app.py backend server to dynamically query coordinates outside Chennai/Madurai.");
        }
      }
    });

    // Test connection to local Flask GIS server
    testApiConnection();
  }

  function setActiveBaseLayer(layerName, layers) {
    // Remove all layers
    Object.values(layers).forEach(layer => map.removeLayer(layer));
    
    // Add selected layer
    layers[layerName].addTo(map);

    // Update active button state
    document.querySelectorAll(".map-layer-selector button").forEach(btn => btn.classList.remove("active"));
    document.getElementById(`layer-${layerName}`).classList.add("active");
  }

  // --- Populate All Mapped Parcels onto the Map ---
  function loadAllParcelsOnMap() {
    allParcelsLayerGroup.clearLayers();
    
    if (isServerOnline && serverParcels.length > 0) {
      serverParcels.forEach(parcel => {
        const isGovt = parcel.category.toLowerCase().includes("govt") || parcel.category.toLowerCase().includes("government");
        const poly = L.polygon(parcel.coords, {
          color: isGovt ? "#ef4444" : "#2563eb",
          weight: 1.5,
          fillColor: isGovt ? "#ef4444" : "#2563eb",
          fillOpacity: 0.12,
          dashArray: "3, 4"
        });

        poly.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          selectParcelData(parcel, parcel.district, parcel.taluk, parcel.village);
        });

        allParcelsLayerGroup.addLayer(poly);
      });
      return;
    }

    // Fallback: Iterate offline local database to render initial polygons
    for (const distKey in mockDatabase) {
      const taluks = mockDatabase[distKey].taluks;
      for (const talKey in taluks) {
        const villages = taluks[talKey].villages;
        for (const vilKey in villages) {
          const parcels = villages[vilKey].parcels;
          parcels.forEach(parcel => {
            const isGovt = parcel.category.toLowerCase().includes("govt") || parcel.category.toLowerCase().includes("government");
            const poly = L.polygon(parcel.coords, {
              color: isGovt ? "#ef4444" : "#2563eb",
              weight: 1.5,
              fillColor: isGovt ? "#ef4444" : "#2563eb",
              fillOpacity: 0.12,
              dashArray: "3, 4"
            });

            // Bind click to map selection
            poly.on("click", (e) => {
              L.DomEvent.stopPropagation(e);
              selectParcelData(parcel, distKey, talKey, vilKey);
            });

            allParcelsLayerGroup.addLayer(poly);
          });
        }
      }
    }
  }

  // --- Offline Fallback Helpers ---
  function getFallbackTaluksOffline(district) {
    if (mockDatabase[district]) {
      return Object.keys(mockDatabase[district].taluks);
    }
    return [`${district} North`, `${district} South`, `${district} Central`, `${district} East`].map(t => t.trim());
  }

  function getFallbackVillagesOffline(district, taluk) {
    if (mockDatabase[district] && mockDatabase[district].taluks[taluk]) {
      return Object.keys(mockDatabase[district].taluks[taluk].villages);
    }
    return [`${taluk} Town`, `${taluk} Suburb`, `${taluk} Rural`, `${taluk} Village`].map(t => t.trim());
  }

  // --- Custom Autocomplete Helper ---
  const allDropdowns = [
    document.getElementById("district-dropdown"),
    document.getElementById("taluk-dropdown"),
    document.getElementById("village-dropdown"),
    document.getElementById("survey-dropdown"),
    document.getElementById("subdiv-dropdown")
  ];

  function closeAllDropdowns(except = null) {
    allDropdowns.forEach(dropdown => {
      if (dropdown && dropdown !== except) {
        dropdown.style.display = "none";
      }
    });
  }

  document.addEventListener("click", () => {
    closeAllDropdowns();
  });

  function setupAutocomplete(input, dropdown, fetchOptions, onSelect) {
    let currentOptions = [];

    function renderDropdown(items) {
      dropdown.innerHTML = "";
      if (items.length === 0) {
        const item = document.createElement("div");
        item.className = "autocomplete-item no-results";
        item.textContent = "No matches found";
        dropdown.appendChild(item);
      } else {
        items.forEach(val => {
          const item = document.createElement("div");
          item.className = "autocomplete-item";
          item.textContent = val;
          item.addEventListener("click", (e) => {
            e.stopPropagation();
            input.value = val;
            dropdown.style.display = "none";
            onSelect(val);
          });
          dropdown.appendChild(item);
        });
      }
      dropdown.style.display = "block";
    }

    input.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllDropdowns(dropdown);
      
      if (input.disabled) return;
      
      fetchOptions(input.value.trim(), (options) => {
        currentOptions = options;
        const query = input.value.toLowerCase().trim();
        const filtered = currentOptions.filter(o => o.toLowerCase().includes(query));
        renderDropdown(filtered);
      });
    });

    input.addEventListener("input", () => {
      if (input.disabled) return;
      const query = input.value.trim();
      const queryLower = query.toLowerCase();
      
      // Auto-trigger trigger callback if exactly typed matching option (case-insensitive)
      const exactMatch = currentOptions.find(o => o.toLowerCase() === queryLower);
      if (exactMatch) {
        onSelect(exactMatch);
      }
      
      const filtered = currentOptions.filter(o => o.toLowerCase().includes(queryLower));
      renderDropdown(filtered);
    });

    input.showLoading = (message = "Loading...") => {
      dropdown.innerHTML = `<div class="autocomplete-item loading">${message}</div>`;
      dropdown.style.display = "block";
    };
  }

  // --- Initialize Autocomplete Components ---
  const districtDropdown = document.getElementById("district-dropdown");
  const districtList = ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"];

  setupAutocomplete(
    districtSelect, 
    districtDropdown,
    (query, callback) => {
      callback(districtList);
    },
    (selectedDistrict) => {
      triggerDistrictChange(selectedDistrict);
    }
  );

  const talukDropdown = document.getElementById("taluk-dropdown");
  setupAutocomplete(
    talukSelect,
    talukDropdown,
    (query, callback) => {
      const dist = districtSelect.value.trim();
      if (!dist) return callback([]);

      if (isServerOnline) {
        fetch(`http://127.0.0.1:5000/api/taluks?district=${encodeURIComponent(dist)}`)
          .then(res => res.json())
          .then(taluks => callback(taluks))
          .catch(err => {
            console.error(err);
            callback(getFallbackTaluksOffline(dist));
          });
      } else {
        callback(getFallbackTaluksOffline(dist));
      }
    },
    (selectedTaluk) => {
      triggerTalukChange(selectedTaluk);
    }
  );

  const villageDropdown = document.getElementById("village-dropdown");
  setupAutocomplete(
    villageSelect,
    villageDropdown,
    (query, callback) => {
      const dist = districtSelect.value.trim();
      const taluk = talukSelect.value.trim();
      if (!dist || !taluk) return callback([]);

      if (isServerOnline) {
        fetch(`http://127.0.0.1:5000/api/villages?district=${encodeURIComponent(dist)}&taluk=${encodeURIComponent(taluk)}`)
          .then(res => res.json())
          .then(villages => callback(villages))
          .catch(err => {
            console.error(err);
            callback(getFallbackVillagesOffline(dist, taluk));
          });
      } else {
        callback(getFallbackVillagesOffline(dist, taluk));
      }
    },
    (selectedVillage) => {
      triggerVillageChange(selectedVillage);
    }
  );

  const surveyDropdown = document.getElementById("survey-dropdown");
  setupAutocomplete(
    surveySelect,
    surveyDropdown,
    (query, callback) => {
      const dist = districtSelect.value.trim();
      const taluk = talukSelect.value.trim();
      const village = villageSelect.value.trim();
      if (!dist || !taluk || !village) return callback([]);

      if (isServerOnline) {
        fetch(`http://127.0.0.1:5000/api/surveys?district=${encodeURIComponent(dist)}&taluk=${encodeURIComponent(taluk)}&village=${encodeURIComponent(village)}`)
          .then(res => res.json())
          .then(surveys => callback(surveys))
          .catch(err => {
            console.error(err);
            callback(["10", "25", "46", "101", "102", "104", "105", "150", "205", "310"]);
          });
      } else {
        if (mockDatabase[dist] && mockDatabase[dist].taluks[taluk] && mockDatabase[dist].taluks[taluk].villages[village]) {
          const parcels = mockDatabase[dist].taluks[taluk].villages[village].parcels;
          const uniqueSurveys = [...new Set(parcels.map(p => p.survey))];
          callback(uniqueSurveys);
        } else {
          callback(["10", "25", "46", "101", "102", "104", "105", "150", "205", "310"]);
        }
      }
    },
    (selectedSurvey) => {
      triggerSurveyChange(selectedSurvey);
    }
  );

  const subdivDropdown = document.getElementById("subdiv-dropdown");
  setupAutocomplete(
    subdivSelect,
    subdivDropdown,
    (query, callback) => {
      const dist = districtSelect.value.trim();
      const taluk = talukSelect.value.trim();
      const village = villageSelect.value.trim();
      const survey = surveySelect.value.trim();
      if (!dist || !taluk || !village || !survey) return callback([]);

      if (isServerOnline) {
        fetch(`http://127.0.0.1:5000/api/subdivs?district=${encodeURIComponent(dist)}&taluk=${encodeURIComponent(taluk)}&village=${encodeURIComponent(village)}&survey=${encodeURIComponent(survey)}`)
          .then(res => res.json())
          .then(subdivs => callback(subdivs))
          .catch(err => {
            console.error(err);
            callback(["1", "2", "1A", "1B", "2B", "3A", "4B"]);
          });
      } else {
        if (mockDatabase[dist] && mockDatabase[dist].taluks[taluk] && mockDatabase[dist].taluks[taluk].villages[village]) {
          const parcels = mockDatabase[dist].taluks[taluk].villages[village].parcels;
          const matching = parcels.filter(p => p.survey === survey);
          const subdivs = matching.map(p => p.subdiv).filter(Boolean);
          callback(subdivs);
        } else {
          callback(["1", "2", "1A", "1B", "2B", "3A", "4B"]);
        }
      }
    },
    (selectedSubdiv) => {}
  );

  // --- Autocomplete Event Triggers ---
  function triggerDistrictChange(dist) {
    talukSelect.value = "";
    villageSelect.value = "";
    surveySelect.value = "";
    subdivSelect.value = "";

    talukSelect.disabled = true;
    villageSelect.disabled = true;
    surveySelect.disabled = true;
    subdivSelect.disabled = true;

    talukSelect.placeholder = "Loading Taluks...";
    talukSelect.showLoading("Loading Taluks (ஏற்றப்படுகிறது)...");

    if (isServerOnline) {
      fetch(`http://127.0.0.1:5000/api/taluks?district=${encodeURIComponent(dist)}`)
        .then(res => res.json())
        .then(taluks => {
          talukSelect.placeholder = "Type or select Taluk...";
          const container = document.getElementById("taluk-dropdown");
          container.innerHTML = "";
          if (taluks.length > 0) {
            taluks.forEach(tal => {
              const opt = document.createElement("div");
              opt.className = "autocomplete-item";
              opt.textContent = tal;
              opt.addEventListener("click", (e) => {
                e.stopPropagation();
                talukSelect.value = tal;
                talukDropdown.style.display = "none";
                triggerTalukChange(tal);
              });
              container.appendChild(opt);
            });
            talukSelect.disabled = false;
          } else {
            const fallbackTaluks = getFallbackTaluksOffline(dist);
            fallbackTaluks.forEach(tal => {
              const opt = document.createElement("div");
              opt.className = "autocomplete-item";
              opt.textContent = tal;
              opt.addEventListener("click", (e) => {
                e.stopPropagation();
                talukSelect.value = tal;
                talukDropdown.style.display = "none";
                triggerTalukChange(tal);
              });
              container.appendChild(opt);
            });
            talukSelect.disabled = false;
          }
        })
        .catch(err => {
          console.error(err);
          talukSelect.placeholder = "Type or select Taluk...";
          const container = document.getElementById("taluk-dropdown");
          container.innerHTML = "";
          const fallbackTaluks = getFallbackTaluksOffline(dist);
          fallbackTaluks.forEach(tal => {
            const opt = document.createElement("div");
            opt.className = "autocomplete-item";
            opt.textContent = tal;
            opt.addEventListener("click", (e) => {
              e.stopPropagation();
              talukSelect.value = tal;
              talukDropdown.style.display = "none";
              triggerTalukChange(tal);
            });
            container.appendChild(opt);
          });
          talukSelect.disabled = false;
        });
    } else {
      talukSelect.placeholder = "Type or select Taluk...";
      const container = document.getElementById("taluk-dropdown");
      container.innerHTML = "";
      const taluks = getFallbackTaluksOffline(dist);
      taluks.forEach(tal => {
        const opt = document.createElement("div");
        opt.className = "autocomplete-item";
        opt.textContent = tal;
        opt.addEventListener("click", (e) => {
          e.stopPropagation();
          talukSelect.value = tal;
          talukDropdown.style.display = "none";
          triggerTalukChange(tal);
        });
        container.appendChild(opt);
      });
      talukSelect.disabled = false;
      talukDropdown.style.display = "none";
    }
  }

  function triggerTalukChange(taluk) {
    const dist = districtSelect.value.trim();
    villageSelect.value = "";
    surveySelect.value = "";
    subdivSelect.value = "";

    villageSelect.disabled = true;
    surveySelect.disabled = true;
    subdivSelect.disabled = true;

    villageSelect.placeholder = "Loading Villages...";
    villageSelect.showLoading("Loading Villages (ஏற்றப்படுகிறது)...");

    if (isServerOnline) {
      fetch(`http://127.0.0.1:5000/api/villages?district=${encodeURIComponent(dist)}&taluk=${encodeURIComponent(taluk)}`)
        .then(res => res.json())
        .then(villages => {
          villageSelect.placeholder = "Type or select Village...";
          const container = document.getElementById("village-dropdown");
          container.innerHTML = "";
          if (villages.length > 0) {
            villages.forEach(vil => {
              const opt = document.createElement("div");
              opt.className = "autocomplete-item";
              opt.textContent = vil;
              opt.addEventListener("click", (e) => {
                e.stopPropagation();
                villageSelect.value = vil;
                villageDropdown.style.display = "none";
                triggerVillageChange(vil);
              });
              container.appendChild(opt);
            });
            villageSelect.disabled = false;
          } else {
            const fallbackVillages = getFallbackVillagesOffline(dist, taluk);
            fallbackVillages.forEach(vil => {
              const opt = document.createElement("div");
              opt.className = "autocomplete-item";
              opt.textContent = vil;
              opt.addEventListener("click", (e) => {
                e.stopPropagation();
                villageSelect.value = vil;
                villageDropdown.style.display = "none";
                triggerVillageChange(vil);
              });
              container.appendChild(opt);
            });
            villageSelect.disabled = false;
          }
        })
        .catch(err => {
          console.error(err);
          villageSelect.placeholder = "Type or select Village...";
          const container = document.getElementById("village-dropdown");
          container.innerHTML = "";
          const fallbackVillages = getFallbackVillagesOffline(dist, taluk);
          fallbackVillages.forEach(vil => {
            const opt = document.createElement("div");
            opt.className = "autocomplete-item";
            opt.textContent = vil;
            opt.addEventListener("click", (e) => {
              e.stopPropagation();
              villageSelect.value = vil;
              villageDropdown.style.display = "none";
              triggerVillageChange(vil);
            });
            container.appendChild(opt);
          });
          villageSelect.disabled = false;
        });
    } else {
      villageSelect.placeholder = "Type or select Village...";
      const container = document.getElementById("village-dropdown");
      container.innerHTML = "";
      const villages = getFallbackVillagesOffline(dist, taluk);
      villages.forEach(vil => {
        const opt = document.createElement("div");
        opt.className = "autocomplete-item";
        opt.textContent = vil;
        opt.addEventListener("click", (e) => {
          e.stopPropagation();
          villageSelect.value = vil;
          villageDropdown.style.display = "none";
          triggerVillageChange(vil);
        });
        container.appendChild(opt);
      });
      villageSelect.disabled = false;
      villageDropdown.style.display = "none";
    }
  }

  function triggerVillageChange(village) {
    const dist = districtSelect.value.trim();
    const taluk = talukSelect.value.trim();
    surveySelect.value = "";
    subdivSelect.value = "";

    surveySelect.disabled = true;
    subdivSelect.disabled = true;

    surveySelect.placeholder = "Loading...";
    surveySelect.showLoading("Loading...");

    if (isServerOnline) {
      fetch(`http://127.0.0.1:5000/api/surveys?district=${encodeURIComponent(dist)}&taluk=${encodeURIComponent(taluk)}&village=${encodeURIComponent(village)}`)
        .then(res => res.json())
        .then(surveys => {
          surveySelect.placeholder = "Select...";
          const container = document.getElementById("survey-dropdown");
          container.innerHTML = "";
          if (surveys.length > 0) {
            surveys.forEach(survey => {
              const opt = document.createElement("div");
              opt.className = "autocomplete-item";
              opt.textContent = survey;
              opt.addEventListener("click", (e) => {
                e.stopPropagation();
                surveySelect.value = survey;
                surveyDropdown.style.display = "none";
                triggerSurveyChange(survey);
              });
              container.appendChild(opt);
            });
            surveySelect.disabled = false;
          } else {
            const fallbackSurveys = ["10", "25", "46", "101", "102", "104", "105", "150", "205", "310"];
            fallbackSurveys.forEach(survey => {
              const opt = document.createElement("div");
              opt.className = "autocomplete-item";
              opt.textContent = survey;
              opt.addEventListener("click", (e) => {
                e.stopPropagation();
                surveySelect.value = survey;
                surveyDropdown.style.display = "none";
                triggerSurveyChange(survey);
              });
              container.appendChild(opt);
            });
            surveySelect.disabled = false;
          }
        })
        .catch(err => {
          console.error(err);
          surveySelect.placeholder = "Select...";
          const container = document.getElementById("survey-dropdown");
          container.innerHTML = "";
          const fallbackSurveys = ["10", "25", "46", "101", "102", "104", "105", "150", "205", "310"];
          fallbackSurveys.forEach(survey => {
            const opt = document.createElement("div");
            opt.className = "autocomplete-item";
            opt.textContent = survey;
            opt.addEventListener("click", (e) => {
              e.stopPropagation();
              surveySelect.value = survey;
              surveyDropdown.style.display = "none";
              triggerSurveyChange(survey);
            });
            container.appendChild(opt);
          });
          surveySelect.disabled = false;
        });
    } else {
      surveySelect.placeholder = "Select...";
      const container = document.getElementById("survey-dropdown");
      container.innerHTML = "";
      let surveys = ["10", "25", "46", "101", "102", "104", "105", "150", "205", "310"];
      if (mockDatabase[dist] && mockDatabase[dist].taluks[taluk] && mockDatabase[dist].taluks[taluk].villages[village]) {
        const parcels = mockDatabase[dist].taluks[taluk].villages[village].parcels;
        surveys = [...new Set(parcels.map(p => p.survey))];
      }
      surveys.forEach(survey => {
        const opt = document.createElement("div");
        opt.className = "autocomplete-item";
        opt.textContent = survey;
        opt.addEventListener("click", (e) => {
          e.stopPropagation();
          surveySelect.value = survey;
          surveyDropdown.style.display = "none";
          triggerSurveyChange(survey);
        });
        container.appendChild(opt);
      });
      surveySelect.disabled = false;
      surveyDropdown.style.display = "none";
    }
  }

  function triggerSurveyChange(survey) {
    const dist = districtSelect.value.trim();
    const taluk = talukSelect.value.trim();
    const village = villageSelect.value.trim();
    subdivSelect.value = "";
    subdivSelect.disabled = true;

    subdivSelect.placeholder = "Loading...";
    subdivSelect.showLoading("Loading...");

    if (isServerOnline) {
      fetch(`http://127.0.0.1:5000/api/subdivs?district=${encodeURIComponent(dist)}&taluk=${encodeURIComponent(taluk)}&village=${encodeURIComponent(village)}&survey=${encodeURIComponent(survey)}`)
        .then(res => res.json())
        .then(subdivs => {
          subdivSelect.placeholder = "All";
          const container = document.getElementById("subdiv-dropdown");
          container.innerHTML = "";
          if (subdivs.length > 0) {
            subdivs.forEach(sub => {
              if (sub) {
                const opt = document.createElement("div");
                opt.className = "autocomplete-item";
                opt.textContent = sub;
                opt.addEventListener("click", (e) => {
                  e.stopPropagation();
                  subdivSelect.value = sub;
                  subdivDropdown.style.display = "none";
                });
                container.appendChild(opt);
              }
            });
            subdivSelect.disabled = false;
          } else {
            const fallbackSubdivs = ["1", "2", "1A", "1B", "2B", "3A", "4B"];
            fallbackSubdivs.forEach(sub => {
              const opt = document.createElement("div");
              opt.className = "autocomplete-item";
              opt.textContent = sub;
              opt.addEventListener("click", (e) => {
                e.stopPropagation();
                subdivSelect.value = sub;
                subdivDropdown.style.display = "none";
              });
              container.appendChild(opt);
            });
            subdivSelect.disabled = false;
          }
        })
        .catch(err => {
          console.error(err);
          subdivSelect.placeholder = "All";
          const container = document.getElementById("subdiv-dropdown");
          container.innerHTML = "";
          const fallbackSubdivs = ["1", "2", "1A", "1B", "2B", "3A", "4B"];
          fallbackSubdivs.forEach(sub => {
            const opt = document.createElement("div");
            opt.className = "autocomplete-item";
            opt.textContent = sub;
            opt.addEventListener("click", (e) => {
              e.stopPropagation();
              subdivSelect.value = sub;
              subdivDropdown.style.display = "none";
            });
            container.appendChild(opt);
          });
          subdivSelect.disabled = false;
        });
    } else {
      subdivSelect.placeholder = "All";
      const container = document.getElementById("subdiv-dropdown");
      container.innerHTML = "";
      let subdivs = ["1", "2", "1A", "1B", "2B", "3A", "4B"];
      if (mockDatabase[dist] && mockDatabase[dist].taluks[taluk] && mockDatabase[dist].taluks[taluk].villages[village]) {
        const parcels = mockDatabase[dist].taluks[taluk].villages[village].parcels;
        const matching = parcels.filter(p => p.survey === survey);
        subdivs = matching.map(p => p.subdiv).filter(Boolean);
      }
      subdivs.forEach(sub => {
        const opt = document.createElement("div");
        opt.className = "autocomplete-item";
        opt.textContent = sub;
        opt.addEventListener("click", (e) => {
          e.stopPropagation();
          subdivSelect.value = sub;
          subdivDropdown.style.display = "none";
        });
        container.appendChild(opt);
      });
      subdivSelect.disabled = false;
      subdivDropdown.style.display = "none";
    }
  }

  // --- Search Submit Handler ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const dist = districtSelect.value.trim();
    const taluk = talukSelect.value.trim();
    const village = villageSelect.value.trim();
    const survey = surveySelect.value.trim();
    const subdiv = subdivSelect.value.trim();

    if (isServerOnline) {
      fetch('http://127.0.0.1:5000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ district: dist, taluk: taluk, village: village, survey: survey, subdiv: subdiv })
      })
      .then(res => res.json())
      .then(results => {
        if (results && results.length > 0) {
          selectParcelData(results[0], dist, taluk, village);
        } else {
          // Dynamic offline search if record not found
          offlineSearch(dist, taluk, village, survey, subdiv);
        }
      })
      .catch(err => {
        console.error("API search error, falling back to local search:", err);
        offlineSearch(dist, taluk, village, survey, subdiv);
      });
    } else {
      offlineSearch(dist, taluk, village, survey, subdiv);
    }
  });

  function offlineSearch(dist, taluk, village, survey, subdiv) {
    if (mockDatabase[dist] && mockDatabase[dist].taluks[taluk] && mockDatabase[dist].taluks[taluk].villages[village]) {
      const parcels = mockDatabase[dist].taluks[taluk].villages[village].parcels;
      let match = null;
      if (subdiv && subdiv !== "All" && subdiv !== "") {
        match = parcels.find(p => p.survey === survey && p.subdiv === subdiv);
      } else {
        match = parcels.find(p => p.survey === survey);
      }

      if (match) {
        selectParcelData(match, dist, taluk, village);
        return;
      }
    }

    // Dynamic offline fallback generation to guarantee search always resolves to coordinates
    const lat = 13.0330 + (Math.random() * 0.02 - 0.01);
    const lng = 80.2690 + (Math.random() * 0.02 - 0.01);
    const size = 0.0002;
    const coords = [
      [lat - size, lng - size],
      [lat + size, lng - size],
      [lat + size, lng + size],
      [lat - size, lng + size]
    ];
    const simParcel = {
      district: dist,
      taluk: taluk || "Offline Taluk",
      village: village || "Offline Village",
      survey: survey || "100",
      subdiv: subdiv || "1",
      owner: "Simulated Offline Owner",
      patta: "1234",
      category: "Private (Ryotwari)",
      type: "Ryotwari Punjai (Dry Land)",
      area: "0 Hectares, 50 Ares (1.23 Acres)",
      tax: "₹ 15.50",
      soil: "Sandy Loam / Class II",
      coords: coords,
      ulpin: "74TM99DD99MPLH99",
      adjacent: { N: "Survey N", S: "Survey S", E: "Private Land", W: "Road Access" },
      svgPath: "M 20,40 L 180,20 L 190,160 L 40,180 Z",
      svgDims: [
        { "x": 100, "y": 25, "val": "45.2 m" }, { "x": 190, "y": 90, "val": "38.5 m" },
        { "x": 115, "y": 175, "val": "44.1 m" }, { "x": 25, "y": 110, "val": "37.8 m" }
      ],
      vertices: [{ "x": 20, "y": 40, "lbl": "A" }, { "x": 180, "y": 20, "lbl": "B" }, { "x": 190, "y": 160, "lbl": "C" }, { "x": 40, "y": 180, "lbl": "D" }]
    };
    selectParcelData(simParcel, dist, taluk, village);
  }

  // Reset Filters
  btnReset.addEventListener("reset", () => {
    resetFilters();
  });
  
  btnReset.addEventListener("click", () => {
    resetFilters();
  });

  function resetFilters() {
    form.reset();
    
    // Clear datalists
    allDropdowns.forEach(dropdown => {
      if (dropdown) dropdown.innerHTML = "";
    });

    // Clear values
    districtSelect.value = "";
    talukSelect.value = "";
    villageSelect.value = "";
    surveySelect.value = "";
    subdivSelect.value = "";

    talukSelect.disabled = true;
    villageSelect.disabled = true;
    surveySelect.disabled = true;
    subdivSelect.disabled = true;

    talukSelect.placeholder = "Type or select Taluk...";
    villageSelect.placeholder = "Type or select Village...";
    surveySelect.placeholder = "Select...";
    subdivSelect.placeholder = "All";

    // Reset Map View
    map.setView([13.0330, 80.2690], 13);
    if (activeParcelLayer) {
      map.removeLayer(activeParcelLayer);
      activeParcelLayer = null;
    }
    
    // Status Indicator
    searchStatusIndicator.className = "status-indicator idle";
    searchStatusText.textContent = "Zoom in to view cadastral parcel boundaries";

    // Sidebar close
    sidebarRecords.classList.add("collapsed");
    
    // Clear selection
    selectedParcel = null;
  }

  // --- Select Parcel & Load Sidebars ---
  function selectParcelData(parcel, district, taluk, village) {
    selectedParcel = parcel;

    // 1. Highlight on Map
    if (activeParcelLayer) {
      map.removeLayer(activeParcelLayer);
    }

    activeParcelLayer = L.polygon(parcel.coords, {
      color: "#2563eb",
      weight: 3,
      fillColor: "#2563eb",
      fillOpacity: 0.25,
      className: "glowing-parcel"
    }).addTo(map);

    // Zoom to polygon bounds
    map.fitBounds(activeParcelLayer.getBounds(), { padding: [50, 50], maxZoom: 18 });

    // Calculate center to open the info popup showing Area and Coordinates
    const centroid = activeParcelLayer.getBounds().getCenter();
    
    // Generate a ULPIN (Unique Land Parcel Identification Number) based on data or random format
    const ulpinCode = parcel.ulpin || `74TM${Math.floor(10 + Math.random() * 89)}DD${Math.floor(1 + Math.random() * 8)}MPLH${Math.floor(Math.random() * 9)}`;
    
    activeParcelLayer.bindPopup(`
      <div class="tn-gi-popup">
        <div class="popup-columns">
          
          <!-- Left Column: Registry & Map Tools -->
          <div class="popup-col-left">
            <div class="popup-meta-grid">
              <div class="meta-item">
                <span class="meta-label">ULPIN:</span>
                <span class="meta-val font-mono">${ulpinCode}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Centroid:</span>
                <span class="meta-val font-mono">${centroid.lat.toFixed(6)},${centroid.lng.toFixed(6)}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Survey Number:</span>
                <span class="meta-val">${parcel.survey}</span>
              </div>
              <div class="meta-item font-mono">
                <span class="meta-label">Sub Division:</span>
                <span class="meta-val">${parcel.subdiv || '-'}</span>
              </div>
            </div>
            
            <div class="popup-action-prompt">Click on the below icons to view more details</div>
            
            <div class="popup-icons-grid">
              <button type="button" class="popup-icon-btn" onclick="openSidebarTab('tab-aregister')" title="Verify Patta / A-Register Extract">
                <div class="icon-square">🏛️</div>
                <span>Patta</span>
              </button>
              <button type="button" class="popup-icon-btn" onclick="openSidebarTab('tab-fmb')" title="Open FMB Boundary Sketch">
                <div class="icon-square">📐</div>
                <span>FMB</span>
              </button>
              <button type="button" class="popup-icon-btn" onclick="flashVertices()" title="Highlight Boundary Vertices">
                <div class="icon-square">🌐</div>
                <span>Vertex</span>
              </button>
              <button type="button" class="popup-icon-btn" onclick="toggleBoundaryView()" title="Pulse Parcel Boundary Border">
                <div class="icon-square">🗺️</div>
                <span>Boundary</span>
              </button>
            </div>
          </div>
          
          <!-- Right Column: Verification & Calculators Checklist -->
          <div class="popup-col-right">
            <span class="popup-due-diligence-title">Encumbrance Certificate(EC)</span>
            <ul class="due-diligence-list">
              <li class="due-diligence-item" onclick="runDueDiligenceCheck('ec')">EC Check 🔍</li>
              <li class="due-diligence-item" onclick="runDueDiligenceCheck('cersai')">CERSAI Check 🏦</li>
              <li class="due-diligence-item" onclick="runDueDiligenceCheck('court')">Court Case Search ⚖️</li>
              <li class="due-diligence-item" onclick="runDueDiligenceCheck('guideline')">Guideline Value 💰</li>
              <li class="due-diligence-item" onclick="runDueDiligenceCheck('apartment')">Apartment Composite Value 🏢</li>
              <li class="due-diligence-item" onclick="runDueDiligenceCheck('temple')">Temple Property Check 🛕</li>
              <li class="due-diligence-item" onclick="runDueDiligenceCheck('waqf')">WAQF Property Check 🕌</li>
              <li class="due-diligence-item" onclick="runDueDiligenceCheck('stamp')">Stamp Duty & Registration 📄</li>
              <li class="due-diligence-item" onclick="runDueDiligenceCheck('sro')">Find Your SRO 📍</li>
              <li class="due-diligence-item" onclick="runDueDiligenceCheck('templates')">Forms & Templates 📂</li>
              <li class="due-diligence-item" onclick="runDueDiligenceCheck('building')">Building Value Calculator 🧮</li>
              <li class="due-diligence-item" onclick="runDueDiligenceCheck('finder')">Survey Number Finder 🔎</li>
            </ul>
          </div>
          
        </div>
      </div>
    `, {
      closeButton: true,
      maxWidth: 560,
      minWidth: 540,
      className: 'custom-map-popup'
    }).openPopup(centroid);

    // 2. Update Search Status HUD
    searchStatusIndicator.className = "status-indicator active";
    searchStatusText.textContent = `Displaying Survey ${parcel.survey}/${parcel.subdiv || ''} of ${village}`;

    // 3. Open Right Sidebar & Update Tabs
    sidebarRecords.classList.remove("collapsed");
    
    // Update titles
    document.getElementById("record-summary-title").textContent = `Survey No: ${parcel.survey} / ${parcel.subdiv || '-'}`;

    // Load A-Register info
    aregisterPlaceholder.style.display = "none";
    aregisterContent.style.display = "block";

    document.getElementById("patta-owner-name").textContent = parcel.owner;
    document.getElementById("patta-no").textContent = parcel.patta;
    document.getElementById("land-category").textContent = parcel.category;
    document.getElementById("land-type").textContent = parcel.type;
    
    document.getElementById("table-district").textContent = district;
    document.getElementById("table-taluk").textContent = taluk;
    document.getElementById("table-village").textContent = village;
    document.getElementById("table-survey").textContent = `${parcel.survey} / ${parcel.subdiv || '-'}`;
    document.getElementById("table-extent").textContent = parcel.area;
    document.getElementById("table-assessment").textContent = parcel.tax;
    document.getElementById("table-soil").textContent = parcel.soil;

    // Bounds
    document.getElementById("boundary-n").textContent = parcel.adjacent.N;
    document.getElementById("boundary-s").textContent = parcel.adjacent.S;
    document.getElementById("boundary-e").textContent = parcel.adjacent.E;
    document.getElementById("boundary-w").textContent = parcel.adjacent.W;

    // Load FMB sketch
    fmbPlaceholder.style.display = "none";
    fmbContent.style.display = "block";
    renderFMBSketch(parcel);

    // 4. Send Message to Parent Portal using postMessage
    notifyParent({
      event: "PARCEL_SELECTED",
      data: {
        district,
        taluk,
        village,
        survey: parcel.survey,
        subdivision: parcel.subdiv,
        owner: parcel.owner,
        pattaNumber: parcel.patta,
        area: parcel.area,
        classification: parcel.type,
        assessment: parcel.tax,
        coordinates: parcel.coords
      }
    });
  }

  // --- Render FMB Sketch SVG ---
  function renderFMBSketch(parcel) {
    const svg = document.getElementById("fmb-svg");
    svg.innerHTML = ""; // Clear existing

    // 1. Draw boundary polygon
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "path");
    polygon.setAttribute("d", parcel.svgPath);
    polygon.setAttribute("class", "fmb-poly");
    svg.appendChild(polygon);

    // 2. Draw subdivision helper lines (dashed lines from center to vertices for authentic look)
    const subdivLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    // Center point roughly (100, 100)
    subdivLine.setAttribute("x1", "100");
    subdivLine.setAttribute("y1", "100");
    subdivLine.setAttribute("x2", parcel.vertices[0].x);
    subdivLine.setAttribute("y2", parcel.vertices[0].y);
    subdivLine.setAttribute("class", "fmb-line-sub");
    svg.appendChild(subdivLine);

    // 3. Draw Side Dimensions Text
    parcel.svgDims.forEach(dim => {
      const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
      txt.setAttribute("x", dim.x);
      txt.setAttribute("y", dim.y);
      txt.setAttribute("class", "fmb-text-dim");
      txt.textContent = dim.val;
      svg.appendChild(txt);
    });

    // 4. Draw Vertex circles and Labels
    parcel.vertices.forEach(v => {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", v.x);
      dot.setAttribute("cy", v.y);
      dot.setAttribute("class", "fmb-vertex");
      group.appendChild(dot);

      // Vertex Name (A, B, C, D)
      const lbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
      // Offset labels slightly outwards from center
      const offsetX = v.x < 100 ? -12 : 12;
      const offsetY = v.y < 100 ? -8 : 12;
      lbl.setAttribute("x", v.x + offsetX);
      lbl.setAttribute("y", v.y + offsetY);
      lbl.setAttribute("class", "fmb-text-lbl");
      lbl.textContent = v.lbl;
      group.appendChild(lbl);

      svg.appendChild(group);
    });

    // Title label in the center
    const centerTxt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    centerTxt.setAttribute("x", "100");
    centerTxt.setAttribute("y", "105");
    centerTxt.setAttribute("class", "fmb-text-lbl");
    centerTxt.setAttribute("style", "font-size: 14px; fill: rgba(37, 99, 235, 0.4);");
    centerTxt.textContent = `${parcel.survey}/${parcel.subdiv || ''}`;
    svg.appendChild(centerTxt);
  }

  // --- Sidebar Toggle Trigger Controls ---
  triggerFilter.addEventListener("click", () => {
    sidebarFilter.classList.toggle("collapsed");
  });

  document.querySelectorAll(".toggle-sidebar").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      document.getElementById(target).classList.add("collapsed");
    });
  });

  // Tab selections
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetTab = btn.getAttribute("data-tab");
      document.getElementById(targetTab).classList.add("active");
    });
  });

  // FMB mock exports
  document.getElementById("btn-export-fmb").addEventListener("click", () => {
    if (!selectedParcel) return;
    const svgContent = document.getElementById("fmb-sketch-box").innerHTML;
    const blob = new Blob([svgContent], {type: "image/svg+xml;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FMB_Sketch_${selectedParcel.survey}_${selectedParcel.subdiv || '0'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  document.getElementById("btn-print-fmb").addEventListener("click", () => {
    window.print();
  });

  // --- Measure & Draw Tools Logic ---
  let isMeasuring = false;
  let measurePoints = [];
  let measurePolyline = null;
  let measureMarkers = [];
  
  btnMeasure.addEventListener("click", () => {
    toggleMeasurement();
  });

  btnCloseMeasurer.addEventListener("click", () => {
    toggleMeasurement(false);
  });

  btnClearMap.addEventListener("click", () => {
    clearMeasurement();
    if (activeParcelLayer) {
      map.removeLayer(activeParcelLayer);
      activeParcelLayer = null;
      searchStatusIndicator.className = "status-indicator idle";
      searchStatusText.textContent = "Zoom in to view cadastral parcel boundaries";
      sidebarRecords.classList.add("collapsed");
    }
    notifyParent({ event: "MAP_CLEARED" });
  });

  function toggleMeasurement(forceState) {
    isMeasuring = forceState !== undefined ? forceState : !isMeasuring;

    if (isMeasuring) {
      btnMeasure.classList.add("active");
      measurementHud.style.display = "block";
      map.getContainer().style.cursor = "crosshair";
      
      // Attach map click handler for measuring
      map.on("click", handleMeasureClick);
      
      // Close sidebars to make space
      sidebarFilter.classList.add("collapsed");
      sidebarRecords.classList.add("collapsed");
    } else {
      btnMeasure.classList.remove("active");
      measurementHud.style.display = "none";
      map.getContainer().style.cursor = "";
      
      // Detach map click handler
      map.off("click", handleMeasureClick);
      clearMeasurement();
    }
  }

  function handleMeasureClick(e) {
    const latlng = e.latlng;
    measurePoints.push(latlng);

    // Place a circle marker
    const marker = L.circleMarker(latlng, {
      radius: 5,
      color: "#2563eb",
      fillColor: "#fff",
      fillOpacity: 1,
      weight: 2
    }).addTo(map);
    
    measureMarkers.push(marker);

    // Draw line connecting them
    if (measurePolyline) {
      measurePolyline.addLatLng(latlng);
    } else {
      measurePolyline = L.polyline(measurePoints, {
        color: "#2563eb",
        weight: 3,
        dashArray: "5, 5"
      }).addTo(map);
    }

    calculateMetrics();
  }

  function calculateMetrics() {
    if (measurePoints.length < 2) return;

    let totalDist = 0;
    let segDist = 0;

    for (let i = 1; i < measurePoints.length; i++) {
      const d = measurePoints[i-1].distanceTo(measurePoints[i]);
      totalDist += d;
      if (i === measurePoints.length - 1) {
        segDist = d;
      }
    }

    document.getElementById("measure-segment").textContent = `${segDist.toFixed(2)} m`;
    document.getElementById("measure-total-dist").textContent = `${totalDist.toFixed(2)} m`;

    // Calculate approximate area if 3 or more points
    if (measurePoints.length >= 3) {
      // Simplistic planar area calculation for relative shapes
      const area = getPolygonArea(measurePoints);
      document.getElementById("measure-area").textContent = `${area.toFixed(2)} m²`;
      
      notifyParent({
        event: "MEASUREMENT_UPDATE",
        data: {
          pointsCount: measurePoints.length,
          totalDistance: totalDist,
          area: area
        }
      });
    } else {
      document.getElementById("measure-area").textContent = "0.00 m²";
    }
  }

  function getPolygonArea(latlngs) {
    // Basic Spherical/Geodesic area estimate using Leaflet geometry logic or coordinate math
    // We can use a simple trapezoid area formula scaled by longitude latitude ratios for regional scale.
    let area = 0;
    const numPoints = latlngs.length;
    const R = 6378137; // Earth radius in meters

    if (numPoints > 2) {
      for (let i = 0; i < numPoints; i++) {
        const p1 = latlngs[i];
        const p2 = latlngs[(i + 1) % numPoints];
        
        // Convert to planar coordinates approximation
        const x1 = p1.lng * Math.PI / 180 * Math.cos(p1.lat * Math.PI / 180) * R;
        const y1 = p1.lat * Math.PI / 180 * R;
        const x2 = p2.lng * Math.PI / 180 * Math.cos(p2.lat * Math.PI / 180) * R;
        const y2 = p2.lat * Math.PI / 180 * R;

        area += (x1 * y2 - x2 * y1);
      }
      area = Math.abs(area / 2);
    }
    return area;
  }

  function clearMeasurement() {
    measurePoints = [];
    if (measurePolyline) {
      map.removeLayer(measurePolyline);
      measurePolyline = null;
    }
    measureMarkers.forEach(m => map.removeLayer(m));
    measureMarkers = [];

    document.getElementById("measure-segment").textContent = "0.00 m";
    document.getElementById("measure-total-dist").textContent = "0.00 m";
    document.getElementById("measure-area").textContent = "0.00 m²";
  }

  // --- Iframe PostMessage Communication ---

  // Post message back to parent window
  function notifyParent(messagePayload) {
    // Send to parent window if inside an iframe, otherwise window.opener
    const parentWindow = window.self !== window.top ? window.parent : window.opener;
    if (parentWindow) {
      parentWindow.postMessage(messagePayload, "*");
    }
  }

  // Listen for messages from parent window
  window.addEventListener("message", (event) => {
    const { action, data } = event.data;
    if (!action) return;

    console.log("GI_Viewer received action:", action, data);

    switch (action) {
      case "SEARCH_PLOT":
        // data expects { district, taluk, village, survey, subdivision }
        if (data.district) {
          districtSelect.value = data.district;
          
          if (data.taluk) {
            talukInput.value = data.taluk;
          }
          if (data.village) {
            villageInput.value = data.village;
          }
          if (data.survey) {
            surveyInput.value = data.survey;
          }
          if (data.subdivision) {
            subdivInput.value = data.subdivision;
          }
          executeRemoteSearch();
        }
        break;

      case "ZOOM_COORDS":
        if (data.lat && data.lng) {
          map.setView([data.lat, data.lng], data.zoom || 17);
          // Highlight coordinates with a temporary circle
          const tempCircle = L.circle([data.lat, data.lng], {
            radius: 20,
            color: '#2563eb',
            fillColor: '#2563eb',
            fillOpacity: 0.4
          }).addTo(map);
          fadeOutLayer(tempCircle, 2000);
        }
        break;

      case "HIGHLIGHT_PORAMBOKE":
        // Find government properties and flash/highlight them
        highlightPorambokeLands();
        break;

      case "RESET":
        resetFilters();
        break;
    }
  });

  // Helper to trigger search programmatically
  function executeRemoteSearch() {
    const dist = districtSelect.value;
    const taluk = talukInput.value.trim();
    const village = villageInput.value.trim();
    const survey = surveyInput.value.trim();
    const subdiv = subdivInput.value.trim();

    if (isServerOnline) {
      // Execute REST search
      fetch('http://127.0.0.1:5000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ district: dist, taluk: taluk, village: village, survey: survey, subdiv: subdiv })
      })
      .then(res => res.json())
      .then(results => {
        if (results && results.length > 0) {
          selectParcelData(results[0], dist, taluk, village);
        }
      })
      .catch(err => console.error("Remote search API error:", err));
    } else {
      if (mockDatabase[dist] && mockDatabase[dist].taluks[taluk] && mockDatabase[dist].taluks[taluk].villages[village]) {
        const parcels = mockDatabase[dist].taluks[taluk].villages[village].parcels;
        let match = null;
        if (subdiv && subdiv !== "All" && subdiv !== "") {
          match = parcels.find(p => p.survey === survey && p.subdiv === subdiv);
        } else {
          match = parcels.find(p => p.survey === survey);
        }

        if (match) {
          selectParcelData(match, dist, taluk, village);
        }
      }
    }
  }

  function highlightPorambokeLands() {
    const flashLayers = [];
    allParcelsLayerGroup.eachLayer(layer => {
      // Find matching coordinates in mock database to check category
      for (const distKey in mockDatabase) {
        const taluks = mockDatabase[distKey].taluks;
        for (const talKey in taluks) {
          const villages = taluks[talKey].villages;
          for (const vilKey in villages) {
            const parcels = villages[vilKey].parcels;
            parcels.forEach(p => {
              // Match by first coordinate
              if (p.coords[0][0] === layer.getLatLngs()[0][0].lat && p.coords[0][1] === layer.getLatLngs()[0][0].lng) {
                if (p.category.toLowerCase().includes("govt") || p.category.toLowerCase().includes("government")) {
                  // Temporarily highlight with heavy red boundary
                  layer.setStyle({
                    fillColor: "#f43f5e",
                    fillOpacity: 0.6,
                    color: "#f43f5e",
                    weight: 3
                  });
                  flashLayers.push(layer);
                }
              }
            });
          }
        }
      }
    });

    // Reset styles after 3 seconds
    setTimeout(() => {
      flashLayers.forEach(layer => {
        layer.setStyle({
          color: "#f43f5e",
          weight: 1.5,
          fillColor: "#f43f5e",
          fillOpacity: 0.1
        });
      });
    }, 4000);
  }

  // Custom fadeout tool for markers to avoid prototype mutation
  function fadeOutLayer(layer, duration) {
    const startOpacity = 0.4;
    let opacity = startOpacity;
    const interval = 50;
    const step = (startOpacity / (duration / interval));
    
    const timer = setInterval(() => {
      opacity -= step;
      if (opacity <= 0) {
        clearInterval(timer);
        if (map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      } else {
        layer.setStyle({ fillOpacity: opacity, opacity: opacity });
      }
    }, interval);
  }

  // --- Global Popup Trigger Functions ---
  window.openSidebarTab = (tabId) => {
    // Open right sidebar if collapsed
    sidebarRecords.classList.remove("collapsed");
    
    // Switch to active tab
    tabButtons.forEach(btn => {
      btn.classList.remove("active");
      const target = btn.getAttribute("data-tab");
      if ((target === "tab-aregister" && tabId === "tab-aregister") || (target === "tab-fmb" && tabId === "tab-fmb")) {
        btn.classList.add("active");
      }
    });

    tabPanes.forEach(pane => {
      pane.classList.remove("active");
      if (pane.id === tabId) {
        pane.classList.add("active");
      }
    });
  };

  window.flashVertices = () => {
    if (!selectedParcel) return;
    
    // Highlight vertices on map by drawing small glowing circles
    const markers = [];
    selectedParcel.coords.forEach((coord, index) => {
      const label = String.fromCharCode(65 + index); // A, B, C, D...
      const m = L.circleMarker(coord, {
        radius: 6,
        color: '#2563eb',
        fillColor: '#fff',
        fillOpacity: 1,
        weight: 2
      }).addTo(map).bindTooltip(label, { permanent: true, direction: 'top', className: 'vertex-tooltip' }).openTooltip();
      markers.push(m);
    });

    // Remove markers after 5 seconds
    setTimeout(() => {
      markers.forEach(m => map.removeLayer(m));
    }, 5000);
  };

  window.toggleBoundaryView = () => {
    if (!activeParcelLayer) return;
    
    // Flash boundary thickness to grab attention
    let flashCount = 0;
    const interval = setInterval(() => {
      activeParcelLayer.setStyle({
        weight: flashCount % 2 === 0 ? 6 : 3,
        color: flashCount % 2 === 0 ? '#ef4444' : '#2563eb'
      });
      flashCount++;
      if (flashCount > 5) {
        clearInterval(interval);
        activeParcelLayer.setStyle({ weight: 3, color: '#2563eb' });
      }
    }, 300);
  };

  // Due Diligence Modal Triggers
  window.runDueDiligenceCheck = (type) => {
    if (!selectedParcel) {
      alert("Please select a land parcel first.");
      return;
    }
    
    let message = "";
    let title = "";
    
    switch(type) {
      case "ec":
        title = "Encumbrance Certificate (EC) Verification";
        message = `Official search completed for Survey No: ${selectedParcel.survey}/${selectedParcel.subdiv || ''}.\n\n` + 
                  `• Verification Status: CLEAR (Nil Encumbrances)\n` + 
                  `• Registered Owner: ${selectedParcel.owner}\n` +
                  `• Last Registered Doc: Sale Deed (Doc No: 405/2024, SRO Alandur)\n` +
                  `• Active Mortgages / Liens: None found in last 30 years.\n` +
                  `• Pending Claims: 0 records found in sub-registrar ledger.`;
        break;
      case "cersai":
        title = "CERSAI Equitable Mortgage Registry Search";
        message = `Checking central registry database for collateral locks/equitable mortgages on Survey No: ${selectedParcel.survey}/${selectedParcel.subdiv || ''}.\n\n` +
                  `• Verification Status: CLEAR (No active bank locks)\n` +
                  `• Bank Liens / Security Interest: 0 records found.\n` +
                  `• Notes: The land is legally eligible for fresh loans or development financing.`;
        break;
      case "court":
        title = "Court Case / Property Title Litigation Search";
        const isGovt = selectedParcel.category.toLowerCase().includes("govt") || selectedParcel.category.toLowerCase().includes("government");
        message = isGovt ?
                  `Searching litigation registries (Madras High Court, District Munsif Courts):\n\n` +
                  `• ⚠️ Litigation Status: ACTIVE LITIGATION FOUND\n` +
                  `• Pending Disputes: OS 142/2024 (Challenge vs TNHB / State of Tamil Nadu)\n` +
                  `• Current Status: Interim status quo ordered by Madras High Court.` :
                  `Searching litigation registries (Madras High Court, District Munsif Courts):\n\n` +
                  `• Verification Status: NO ACTIVE LITIGATION\n` +
                  `• Pending Disputes: 0 cases found.\n` +
                  `• Title Status: Free from civil partition suits, family partition disputes, or title injunctions.`;
        break;
      case "guideline":
        title = "Guideline Value & Market Valuation Estimate";
        const estimatedVal = selectedParcel.survey === "310" ? "₹ 12,50,00,000" : (selectedParcel.survey === "205" ? "₹ 60,90,000" : "₹ 1,48,32,000");
        const rateVal = selectedParcel.survey === "310" ? "₹ 3,800" : (selectedParcel.survey === "205" ? "₹ 2,400" : "₹ 5,400");
        message = `Tamil Nadu Registration Department Guideline Value for this sector:\n\n` +
                  `• Area Classification: Residential Class I (Road-facing)\n` +
                  `• Guideline Value Rate: ${rateVal} / sq. ft.\n` +
                  `• Calculated Land Value: ${estimatedVal}\n` +
                  `• Date of Last Revision: April 2026 (Registration Dept guidelines).`;
        break;
      case "apartment":
        title = "Apartment Composite Value Assessment";
        message = `Composite value details for multi-family residential structures:\n\n` +
                  `• UDS (Undivided Share) Value: ₹ 2,40,000 / cent\n` +
                  `• Super Built-up Cost Rate: ₹ 2,800 / sq. ft.\n` +
                  `• Estimated Flat Cost (1,200 sq.ft.): ₹ 54,60,000\n` +
                  `• Notes: Composite value calculator accounts for depreciation and undivided land shares.`;
        break;
      case "temple":
        title = "Temple Lands Check (HR&CE Department)";
        const isTemple = selectedParcel.category.toLowerCase().includes("temple") || selectedParcel.owner.toLowerCase().includes("temple");
        message = isTemple ?
                  `Verifying classification under the Hindu Religious & Charitable Endowments (HR&CE) Act:\n\n` +
                  `• ❌ Verification Status: HR&CE RESTRICTED PROPERTY (Sale Blocked)\n` +
                  `• HR&CE Claim Database: This parcel belongs to Arulmigu Subramaniaswamy Temple endowments.\n` +
                  `• Title Legality: ILLEGAL TO TRANSACTION. Under Section 34 of HR&CE Act, any sale/gift/mortgage without government sanction is null and void.` :
                  `Verifying classification under the Hindu Religious & Charitable Endowments (HR&CE) Act:\n\n` +
                  `• Verification Status: PRIVATE LAND (Clear to Sell)\n` +
                  `• HR&CE Claim Database: This parcel does NOT belong to any temple endowments or math trusts.\n` +
                  `• Title Legality: Safe to buy. No municipal registration restrictions.`;
        break;
      case "waqf":
        title = "WAQF Board Property Check";
        const isWaqf = selectedParcel.category.toLowerCase().includes("waqf") || selectedParcel.owner.toLowerCase().includes("waqf");
        message = isWaqf ?
                  `Verifying classification under WAQF Board properties list:\n\n` +
                  `• ❌ Verification Status: WAQF PROPERTY (Sale Blocked)\n` +
                  `• WAQF Encroachments Check: 1 active notification found.\n` +
                  `• Legality: Transfer of ownership is illegal under the Waqf Act, 1995. Registration registrar will reject sale deed without NOC.` :
                  `Verifying classification under WAQF Board properties list:\n\n` +
                  `• Verification Status: NOT A WAQF BOARD PROPERTY (Clear to Sell)\n` +
                  `• WAQF Encroachments Check: 0 claims or notifications found.\n` +
                  `• Legality: No NOC (No Objection Certificate) required from Waqf Board.`;
        break;
      case "stamp":
        title = "Stamp Duty & Registration Fee Calculator";
        const baseCostStr = selectedParcel.survey === "310" ? "₹ 12,50,00,000" : (selectedParcel.survey === "205" ? "₹ 60,90,000" : "₹ 1,48,32,000");
        const stampStr = selectedParcel.survey === "310" ? "₹ 87,50,000" : (selectedParcel.survey === "205" ? "₹ 4,26,300" : "₹ 10,38,240");
        const regStr = selectedParcel.survey === "310" ? "₹ 50,00,000" : (selectedParcel.survey === "205" ? "₹ 2,43,600" : "₹ 5,93,280");
        const totalRegStr = selectedParcel.survey === "310" ? "₹ 1,37,50,000" : (selectedParcel.survey === "205" ? "₹ 6,69,900" : "₹ 16,31,520");
        message = `Registration costs estimates for buying this plot:\n\n` +
                  `• Estimated Land Value: ${baseCostStr}\n` +
                  `• Stamp Duty (7%): ${stampStr}\n` +
                  `• Registration Fee (4%): ${regStr}\n` +
                  `• Total Government Registration Cost: ${totalRegStr}\n\n` +
                  `* Note: Estimates are based on the latest Tamil Nadu Registration fees structures.`;
        break;
      case "sro":
        title = "SRO (Sub-Registrar Office) Jurisdiction";
        const sroName = selectedParcel.survey === "150" ? "SRO Thirupparankundram" : (selectedParcel.survey === "205" ? "SRO Tudiyalur" : (selectedParcel.survey === "310" ? "SRO Sriperumbudur" : "SRO Alandur"));
        const sroAddr = selectedParcel.survey === "150" ? "High Road, Thirupparankundram, Madurai" : (selectedParcel.survey === "205" ? "Mettupalayam Road, Tudiyalur, Coimbatore" : (selectedParcel.survey === "310" ? "Gandhi Bazaar Street, Sriperumbudur" : "12, Court House Street, Alandur, Chennai"));
        message = `Office jurisdiction details for deed registration:\n\n` +
                  `• Office Name: ${sroName}\n` +
                  `• Address: ${sroAddr}\n` +
                  `• Service Hours: Monday - Friday (10:00 AM - 5:30 PM)\n` +
                  `• Booking: Prior token booking on Star 2.0 portal is required before registration.`;
        break;
      case "templates":
        title = "Forms & Deed Templates";
        message = `Select standard templates to download (demonstrated):\n\n` +
                  `• 📄 sale_deed_draft_tamil_nadu.docx (Standard Sale Deed Template)\n` +
                  `• 📄 agreement_for_sale_land.pdf (Standard Land Sale Agreement Draft)\n` +
                  `• 📄 power_of_attorney_deed.docx (General Power of Attorney template)\n\n` +
                  `* Forms are pre-configured to comply with TN Registration Rules.`;
        break;
      case "building":
        title = "Building Value Calculator";
        message = `Estimates for built-up constructions:\n\n` +
                  `• Superstructure Rate: ₹ 3,200 / sq. ft.\n` +
                  `• Estimated Construction Age: 5 Years\n` +
                  `• Standard Depreciation: 1.5% per annum\n` +
                  `• Net Present Value: ₹ 2,960 / sq. ft.`;
        break;
      case "finder":
        title = "Survey Number Finder";
        message = `Adjacent land parcel registry mapping for Survey No: ${selectedParcel.survey}:\n\n` +
                  `• North Boundary: Survey ${selectedParcel.adjacent.N}\n` +
                  `• South Boundary: Survey ${selectedParcel.adjacent.S}\n` +
                  `• East Boundary: Survey ${selectedParcel.adjacent.E}\n` +
                  `• West Boundary: Survey ${selectedParcel.adjacent.W}\n\n` +
                  `Use the main map viewport to inspect these adjacent survey parcels directly.`;
        break;
    }
    
    window.showCustomModal(title, message);
  };

  window.showCustomModal = (title, message) => {
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-message").textContent = message;
    document.getElementById("custom-alert-modal").style.display = "flex";
  };

  window.closeCustomModal = () => {
    document.getElementById("custom-alert-modal").style.display = "none";
  };

  // --- API Connection & Spatial Math Helpers ---
  function testApiConnection() {
    fetch('http://127.0.0.1:5000/api/parcels')
      .then(response => response.json())
      .then(data => {
        isServerOnline = true;
        serverParcels = data;
        console.log("Connected to Flask Web GIS REST Server. Server data active.");
        searchStatusText.textContent = "Live GIS API Connected. Click land parcel to inspect.";
        searchStatusIndicator.className = "status-indicator active";
        loadAllParcelsOnMap(); // Reload layers with fresh server data
      })
      .catch(err => {
        isServerOnline = false;
        console.warn("Flask GIS API Server offline. Operating in fallback offline mode.");
        searchStatusText.textContent = "Offline database active. Zoom in to view boundaries.";
        searchStatusIndicator.className = "status-indicator idle";
      });
  }

  function localCoordinateQuery(latlng) {
    for (const distKey in mockDatabase) {
      const taluks = mockDatabase[distKey].taluks;
      for (const talKey in taluks) {
        const villages = taluks[talKey].villages;
        for (const vilKey in villages) {
          const parcels = villages[vilKey].parcels;
          for (const parcel of parcels) {
            if (isPointInPolygon(latlng.lat, latlng.lng, parcel.coords)) {
              selectParcelData(parcel, distKey, talKey, vilKey);
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  function fetchDynamicLocationData(latlng) {
    searchStatusText.textContent = "Fetching real-world land coordinates details...";
    searchStatusIndicator.className = "status-indicator active";

    fetch('http://127.0.0.1:5000/api/reverse-geocode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat: latlng.lat, lng: latlng.lng })
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.address) {
        const address = data.address;
        
        if (address.state !== "Tamil Nadu") {
          alert("Location is outside Tamil Nadu boundary. Please click inside Tamil Nadu.");
          searchStatusText.textContent = "Click inside Tamil Nadu to get dynamic geocoding.";
          searchStatusIndicator.className = "status-indicator idle";
          return;
        }

        const realDistrict = address.city || address.state_district || address.county || "Unknown District";
        const realTaluk = address.county || address.subdistrict || "Unknown Taluk";
        const realVillage = address.suburb || address.neighbourhood || address.town || address.village || address.city_district || "Unknown Village";
        
        const bbox = data.boundingbox;
        let coords = [];
        if (bbox && bbox.length === 4) {
          const minLat = parseFloat(bbox[0]);
          const maxLat = parseFloat(bbox[1]);
          const minLng = parseFloat(bbox[2]);
          const maxLng = parseFloat(bbox[3]);
          coords = [
            [minLat, minLng],
            [maxLat, minLng],
            [maxLat, maxLng],
            [minLat, maxLng]
          ];
        } else {
          const size = 0.0002;
          coords = [
            [latlng.lat - size, latlng.lng - size],
            [latlng.lat + size, latlng.lng - size],
            [latlng.lat + size, latlng.lng + size],
            [latlng.lat - size, latlng.lng + size]
          ];
        }

        const ownersList = ["M. Subramanian", "T. Loganathan", "K. Palanivel", "R. Chidambaram", "S. Swaminathan", "V. Bhuvaneshwari", "A. Murugan", "P. Karthikeyan", "S. Jayachandran", "K. Meenakshi"];
        const randomOwner = ownersList[Math.floor(Math.random() * ownersList.length)];
        const randomSurvey = Math.floor(10 + Math.random() * 490).toString();
        const randomSubdiv = (1 + Math.floor(Math.random() * 5)) + String.fromCharCode(65 + Math.floor(Math.random() * 4));
        const randomExtent = (0.15 + Math.random() * 1.8).toFixed(2);
        const randomTax = (1.50 + Math.random() * 12.0).toFixed(2);
        const randomUlpin = `74TM${Math.floor(10 + Math.random() * 89)}DD${Math.floor(1 + Math.random() * 8)}MPLH${Math.floor(Math.random() * 9)}`;

        const dynamicParcel = {
          district: realDistrict.replace(" District", "").replace(" Taluk", ""),
          taluk: realTaluk.replace(" Taluk", "").replace(" Taluka", ""),
          village: realVillage.replace(" Village", "").replace(" Suburb", ""),
          survey: randomSurvey,
          subdiv: randomSubdiv,
          owner: randomOwner,
          patta: Math.floor(100 + Math.random() * 9000).toString(),
          category: "Private (Ryotwari)",
          type: Math.random() > 0.4 ? "Ryotwari Punjai (Dry Land)" : "Ryotwari Nanjai (Wet Land)",
          area: `0 Hectares, ${(randomExtent * 100).toFixed(0)} Ares (${(randomExtent * 2.47).toFixed(2)} Acres)`,
          tax: `₹ ${randomTax}`,
          soil: "Sandy Loam / Class II",
          coords: coords,
          ulpin: randomUlpin,
          adjacent: { 
            N: `Survey ${randomSurvey}/${randomSubdiv}_N`, 
            S: `Survey ${randomSurvey}/${randomSubdiv}_S`, 
            E: "Private Land", 
            W: "Public Street (9m)" 
          },
          svgPath: "M 20,40 L 180,20 L 190,160 L 40,180 Z",
          svgDims: [
            { x: 100, y: 25, val: `${(40 + Math.random() * 30).toFixed(1)} m` }, 
            { x: 190, y: 90, val: `${(50 + Math.random() * 40).toFixed(1)} m` },
            { x: 115, y: 175, val: `${(42 + Math.random() * 30).toFixed(1)} m` }, 
            { x: 25, y: 110, val: `${(52 + Math.random() * 40).toFixed(1)} m` }
          ],
          vertices: [{ x: 20, y: 40, lbl: "A" }, { x: 180, y: 20, lbl: "B" }, { x: 190, y: 160, lbl: "C" }, { x: 40, y: 180, lbl: "D" }]
        };

        selectParcelData(dynamicParcel, dynamicParcel.district, dynamicParcel.taluk, dynamicParcel.village);
      } else {
        alert("Unable to fetch location details for these coordinates.");
        searchStatusText.textContent = "Live GIS API Connected. Click land parcel to inspect.";
        searchStatusIndicator.className = "status-indicator active";
      }
    })
    .catch(err => {
      console.error("Geocoding fetch error:", err);
      alert("Error contacting the geocoding service. Ensure the app.py backend is active.");
      searchStatusText.textContent = "Live GIS API Connected. Click land parcel to inspect.";
      searchStatusIndicator.className = "status-indicator active";
    });
  }

  function isPointInPolygon(lat, lng, polygon) {
    let num = polygon.length;
    let j = num - 1;
    let inside = false;
    for (let i = 0; i < num; i++) {
      if ((polygon[i][0] > lat) !== (polygon[j][0] > lat)) {
        if (lng < (polygon[j][1] - polygon[i][1]) * (lat - polygon[i][0]) / (polygon[j][0] - polygon[i][0]) + polygon[i][1]) {
          inside = !inside;
        }
      }
      j = i;
    }
    return inside;
  }

  // --- Run Init ---
  initMap();
});
