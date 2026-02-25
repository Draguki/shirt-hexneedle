const fs = require('fs');

const originalHtml = fs.readFileSync('extracted_shirt_designer/Static-Shirt-Designer/client/index.html', 'utf-8');

const updatedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>2D Shirt Configurator</title>
    <style>
        :root {
            --bg-color: #fafafa;
            --surface-color: #ffffff;
            --text-primary: #171717;
            --text-secondary: #525252;
            --border-color: #e5e5e5;
            --accent-color: #171717;
            --accent-hover: #404040;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-primary);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .container {
            display: flex;
            flex-direction: row;
            width: 100%;
            max-width: 1200px;
            height: 90vh;
            background: var(--surface-color);
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.04);
            overflow: hidden;
            margin: 20px;
        }

        /* LEFT: Visualizer */
        .visualizer-section {
            flex: 1;
            position: relative;
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .canvas-container {
            position: relative;
            width: 100%;
            height: 100%;
            max-width: 800px;
        }

        /* Layer definitions */
        .layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
            pointer-events: none;
        }

        /* Fabric masks */
        .fabric-mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            -webkit-mask-size: contain;
            -webkit-mask-position: center;
            -webkit-mask-repeat: no-repeat;
            mask-size: contain;
            mask-position: center;
            mask-repeat: no-repeat;
            mix-blend-mode: multiply;
            pointer-events: none;
        }

        /* Rotated fabric */
        .fabric-rotated {
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            transform: rotate(90deg);
            transform-origin: center;
            background-size: 300px;
            background-position: center;
            background-repeat: repeat;
        }

        /* Normal fabric */
        .fabric-normal {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: 300px;
            background-position: center;
            background-repeat: repeat;
        }

        /* Z-INDEX STACKING */
        #layer-base { z-index: 10; }
        #mask-torso { z-index: 11; }

        #layer-placket { z-index: 20; }
        #mask-placket { z-index: 21; }

        #layer-collar { z-index: 30; }
        #mask-collar { z-index: 31; }

        #layer-cuff { z-index: 40; }
        #mask-cuff { z-index: 41; }
        
        #layer-placket-buttons { z-index: 50; }
        #layer-cuff-buttons { z-index: 51; }
        #layer-collar-buttons { z-index: 52; }

        #layer-white-collar { z-index: 60; display: none; }
        #layer-white-cuff { z-index: 61; display: none; }

        /* Button Colors */
        .button-tint {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            -webkit-mask-size: contain;
            -webkit-mask-position: center;
            -webkit-mask-repeat: no-repeat;
            mask-size: contain;
            mask-position: center;
            mask-repeat: no-repeat;
            mix-blend-mode: multiply;
            opacity: 0.6;
            pointer-events: none;
        }

        /* Custom Select */
        .custom-select-wrapper {
            position: relative;
            user-select: none;
            width: 100%;
        }
        .custom-select {
            display: flex;
            align-items: center;
            padding: 12px 14px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            background-color: var(--surface-color);
            cursor: pointer;
            font-size: 14px;
        }
        .custom-select img {
            width: 24px; height: 24px; border-radius: 50%; object-fit: cover; margin-right: 12px;
            border: 1px solid #eee;
        }
        .custom-options {
            position: absolute;
            top: 100%; left: 0; right: 0;
            background-color: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            margin-top: 4px;
            max-height: 250px;
            overflow-y: auto;
            z-index: 100;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            display: none;
        }
        .custom-options.show {
            display: block;
        }
        .custom-option {
            display: flex;
            align-items: center;
            padding: 10px 14px;
            cursor: pointer;
            transition: background 0.2s;
        }
        .custom-option:hover {
            background-color: #f5f5f5;
        }
        .custom-option img {
            width: 24px; height: 24px; border-radius: 50%; object-fit: cover; margin-right: 12px;
            border: 1px solid #eee;
        }

        /* RIGHT: Controls */
        .controls-section {
            width: 400px;
            padding: 40px;
            overflow-y: auto;
            border-left: 1px solid var(--border-color);
        }

        .header {
            margin-bottom: 32px;
        }

        .header h1 {
            font-size: 20px;
            font-weight: 500;
            letter-spacing: -0.5px;
            margin-bottom: 4px;
        }

        .header p {
            font-size: 13px;
            color: var(--text-secondary);
        }

        .control-group {
            margin-bottom: 24px;
        }

        .control-group label {
            display: block;
            font-size: 11px;
            font-weight: 600;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-secondary);
        }

        select {
            width: 100%;
            padding: 12px 14px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            font-size: 14px;
            color: var(--text-primary);
            background-color: var(--surface-color);
            appearance: none;
            outline: none;
            cursor: pointer;
            transition: border-color 0.2s;
        }

        select:focus {
            border-color: var(--accent-color);
        }

        .toggle-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            background: #f5f5f5;
            border-radius: 6px;
            margin-bottom: 32px;
            transition: opacity 0.2s ease;
        }

        .toggle-container span {
            font-size: 13px;
            font-weight: 500;
        }

        /* Toggle switch */
        .switch {
            position: relative;
            display: inline-block;
            width: 36px;
            height: 20px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #d4d4d4;
            transition: .3s;
            border-radius: 20px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .3s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: var(--accent-color);
        }

        input:checked + .slider:before {
            transform: translateX(16px);
        }

        .btn {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-bottom: 12px;
        }

        .btn-primary {
            background-color: var(--accent-color);
            color: white;
        }

        .btn-primary:hover {
            background-color: var(--accent-hover);
        }

        .btn-outline {
            background-color: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-primary);
        }

        .btn-outline:hover {
            background-color: #fafafa;
        }

        /* Modals */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
        }

        .modal-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        .modal {
            background: white;
            width: 100%;
            max-width: 400px;
            border-radius: 12px;
            padding: 32px;
            transform: translateY(10px);
            transition: transform 0.2s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            position: relative;
        }

        .modal-overlay.active .modal {
            transform: translateY(0);
        }

        .modal h2 {
            font-size: 18px;
            margin-bottom: 24px;
            font-weight: 500;
        }

        .modal-close {
            position: absolute;
            top: 24px;
            right: 24px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: var(--text-secondary);
        }

        .input-group {
            margin-bottom: 16px;
        }

        .input-group label {
            display: block;
            font-size: 12px;
            margin-bottom: 6px;
            color: var(--text-secondary);
        }

        .input-group input, .input-group select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            font-size: 13px;
        }

        .success-msg {
            display: none;
            padding: 12px;
            background: #f0fdf4;
            color: #166534;
            border: 1px solid #bbf7d0;
            border-radius: 6px;
            margin-bottom: 20px;
            font-size: 13px;
            text-align: center;
        }

        @media (max-width: 800px) {
            .container {
                flex-direction: column;
                height: 100vh;
                margin: 0;
                border-radius: 0;
            }
            .controls-section {
                width: 100%;
                border-left: none;
                border-top: 1px solid var(--border-color);
            }
        }
    </style>
</head>
<body>

    <div class="container">
        <!-- Visualizer -->
        <div class="visualizer-section">
            <div class="canvas-container">
                <!-- Base -->
                <img id="layer-base" class="layer" src="/images/base_1771777480842.png" alt="Base">
                <div id="mask-torso" class="fabric-mask" style="-webkit-mask-image: url('/images/base_1771777480842.png'); mask-image: url('/images/base_1771777480842.png');">
                    <div class="fabric-normal" id="fabric-torso"></div>
                </div>

                <!-- Placket -->
                <img id="layer-placket" class="layer" src="/images/single_placket_1771777512854.png" alt="Placket">
                <div id="mask-placket" class="fabric-mask" style="-webkit-mask-image: url('/images/single_placket_1771777512854.png'); mask-image: url('/images/single_placket_1771777512854.png');">
                    <div class="fabric-rotated" id="fabric-placket"></div>
                </div>

                <!-- Collar -->
                <img id="layer-collar" class="layer" src="/images/spread_1771777500212.png" alt="Collar">
                <div id="mask-collar" class="fabric-mask" style="-webkit-mask-image: url('/images/spread_1771777500212.png'); mask-image: url('/images/spread_1771777500212.png');">
                    <div class="fabric-rotated" id="fabric-collar"></div>
                </div>
                <img id="layer-white-collar" class="layer" src="/images/spread_1771777500212.png" alt="White Collar">

                <!-- Cuff -->
                <img id="layer-cuff" class="layer" src="/images/anglet_cuff_1771777730823.png" alt="Cuff">
                <div id="mask-cuff" class="fabric-mask" style="-webkit-mask-image: url('/images/anglet_cuff_1771777730823.png'); mask-image: url('/images/anglet_cuff_1771777730823.png');">
                    <div class="fabric-rotated" id="fabric-cuff"></div>
                </div>
                <img id="layer-white-cuff" class="layer" src="/images/anglet_cuff_1771777730823.png" alt="White Cuff">
                
                <!-- Buttons (Above Fabric) -->
                <div id="layer-placket-buttons" class="layer">
                    <img id="img-placket-buttons" class="layer" src="">
                    <div id="tint-placket-buttons" class="button-tint"></div>
                </div>

                <div id="layer-cuff-buttons" class="layer">
                    <img id="img-cuff-buttons" class="layer" src="/images/circular_cuff_and_anglet_button_1771857391258.png">
                    <div id="tint-cuff-buttons" class="button-tint" style="-webkit-mask-image: url('/images/circular_cuff_and_anglet_button_1771857391258.png'); mask-image: url('/images/circular_cuff_and_anglet_button_1771857391258.png');"></div>
                </div>

                <div id="layer-collar-buttons" class="layer" style="display: none;">
                    <img id="img-collar-buttons" class="layer" src="/images/button_down_button_overlay_1771857391258.png">
                    <div id="tint-collar-buttons" class="button-tint" style="-webkit-mask-image: url('/images/button_down_button_overlay_1771857391258.png'); mask-image: url('/images/button_down_button_overlay_1771857391258.png');"></div>
                </div>
            </div>
        </div>

        <!-- Controls -->
        <div class="controls-section">
            <div class="header">
                <h1>Shirt Configurator</h1>
                <p>Customize your perfect shirt</p>
            </div>

            <div class="control-group">
                <label>Fabric</label>
                <div class="custom-select-wrapper" id="fabric-select-wrapper">
                    <div class="custom-select" id="fabric-selected">
                        <img src="" id="fabric-selected-img">
                        <span id="fabric-selected-text">Select Fabric</span>
                    </div>
                    <div class="custom-options" id="fabric-options">
                        <!-- options generated by js -->
                    </div>
                </div>
            </div>
            
            <div class="control-group">
                <label>Button Color</label>
                <select id="select-button-color">
                    <option value="transparent">White</option>
                    <option value="#000000">Black</option>
                    <option value="#000080">Navy Blue</option>
                </select>
            </div>

            <div class="control-group">
                <label>Collar</label>
                <select id="select-collar">
                    <option value="/images/spread_1771777500212.png">Spread</option>
                    <option value="/images/cutaway_1771777500212.png">Cutaway</option>
                    <option value="/images/hidden_button_down_1771777500211.png">Hidden Button Down</option>
                    <option value="/images/button_down_without_button_1771777500211.png">Button Down Without Button</option>
                    <option value="/images/straight_point_1771777500211.png">Straight Point</option>
                </select>
            </div>

            <div class="control-group">
                <label>Placket</label>
                <select id="select-placket">
                    <option value="none">No Placket</option>
                    <option value="/images/single_placket_1771777512854.png" selected>Single Placket</option>
                    <option value="/images/french_placket_1771777512855.png">French Placket</option>
                    <option value="/images/2_button_polo_placket_1771777512854.png">2 Button Polo Placket</option>
                </select>
            </div>

            <div class="control-group">
                <label>Cuff</label>
                <select id="select-cuff">
                    <option value="/images/anglet_cuff_1771777730823.png">Anglet Cuff</option>
                    <option value="/images/circular_cuff_1771777730823.png">Circular Cuff</option>
                    <option value="/images/french_cuff_1771777730822.png">French Cuff</option>
                    <option value="/images/napolean_cuff_1771777730822.png">Napoleon Cuff</option>
                </select>
            </div>

            <div class="toggle-container" id="white-contrast-container">
                <span>White Contrast Collar & Cuff</span>
                <label class="switch">
                    <input type="checkbox" id="toggle-white">
                    <span class="slider"></span>
                </label>
            </div>

            <button class="btn btn-primary" onclick="openModal('modal-fit')">Find My Fit</button>
            <button class="btn btn-outline" onclick="openModal('modal-manual')">Manual Measurement Entry</button>
        </div>
    </div>

    <!-- Modals -->
    <div class="modal-overlay" id="modal-fit" onclick="closeModal(event, 'modal-fit')">
        <div class="modal" onclick="event.stopPropagation()">
            <button class="modal-close" onclick="closeModal(null, 'modal-fit')">&times;</button>
            <h2>Find My Fit</h2>
            <div id="fit-success" class="success-msg">Measurements saved successfully!</div>
            <form onsubmit="handleFormSubmit(event, 'fit-success')">
                <div class="input-group">
                    <label>Height (cm)</label>
                    <input type="number" required>
                </div>
                <div class="input-group">
                    <label>Weight (kg)</label>
                    <input type="number" required>
                </div>
                <div class="input-group">
                    <label>Body Type</label>
                    <select required>
                        <option value="slim">Slim</option>
                        <option value="regular">Regular</option>
                        <option value="athletic">Athletic</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Preferred Fit</label>
                    <select required>
                        <option value="slim">Slim</option>
                        <option value="regular">Regular</option>
                        <option value="relaxed">Relaxed</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Save Fit Profile</button>
            </form>
        </div>
    </div>

    <div class="modal-overlay" id="modal-manual" onclick="closeModal(event, 'modal-manual')">
        <div class="modal" onclick="event.stopPropagation()">
            <button class="modal-close" onclick="closeModal(null, 'modal-manual')">&times;</button>
            <h2>Manual Measurements</h2>
            <div id="manual-success" class="success-msg">Measurements saved successfully!</div>
            <form onsubmit="handleFormSubmit(event, 'manual-success')">
                <div class="input-group">
                    <label>Neck (cm)</label>
                    <input type="number" step="0.1" required>
                </div>
                <div class="input-group">
                    <label>Chest (cm)</label>
                    <input type="number" step="0.1" required>
                </div>
                <div class="input-group">
                    <label>Waist (cm)</label>
                    <input type="number" step="0.1" required>
                </div>
                <div class="input-group">
                    <label>Shoulder (cm)</label>
                    <input type="number" step="0.1" required>
                </div>
                <div class="input-group">
                    <label>Sleeve Length (cm)</label>
                    <input type="number" step="0.1" required>
                </div>
                <div class="input-group">
                    <label>Shirt Length (cm)</label>
                    <input type="number" step="0.1" required>
                </div>
                <button type="submit" class="btn btn-primary">Save Measurements</button>
            </form>
        </div>
    </div>

    <script>
        const state = {
            measurements: {},
            whiteContrast: false
        };

        const fabrics = [
            { name: "Bengal Stripe Oxford", value: "/images/bengal_stripe_oxford_1771777489070.jpg" },
            { name: "Sky Blue Herringbone", value: "/images/SKY_BLUE_HERRING_BONE__1771777489071.png" },
            { name: "White Herringbone", value: "/images/white_herringbone_1771857391260.png" },
            { name: "Light Ice Blue Herringbone", value: "/images/light_ice_blue_herring_bone_1771777489072.png" },
            { name: "Beige Linen", value: "/images/beige_linen_1771777489072.png" },
            { name: "Ice Blue Linen", value: "/images/ice_blue_linen_1771777489073.png" },
            { name: "Navy Blue Linen", value: "/images/navy_blue_linen_1771777489073.png" },
            { name: "Hairline White and Ice Blue", value: "/images/hairline_cotton_1771857391257.png" },
            { name: "White Linen", value: "/images/white_linen_1771857391258.png" }
        ];

        let currentFabric = fabrics[0].value;

        const fabricOptionsContainer = document.getElementById('fabric-options');
        const fabricSelectedImg = document.getElementById('fabric-selected-img');
        const fabricSelectedText = document.getElementById('fabric-selected-text');
        const fabricSelectWrapper = document.getElementById('fabric-select-wrapper');

        fabrics.forEach(f => {
            const opt = document.createElement('div');
            opt.className = 'custom-option';
            opt.innerHTML = \`<img src="\${f.value}"><span>\${f.name}</span>\`;
            opt.onclick = () => {
                currentFabric = f.value;
                fabricSelectedImg.src = f.value;
                fabricSelectedText.textContent = f.name;
                document.getElementById('fabric-options').classList.remove('show');
                updateVisuals();
            };
            fabricOptionsContainer.appendChild(opt);
        });

        // Initialize first
        fabricSelectedImg.src = fabrics[0].value;
        fabricSelectedText.textContent = fabrics[0].name;

        document.getElementById('fabric-selected').onclick = () => {
            document.getElementById('fabric-options').classList.toggle('show');
        };

        document.addEventListener('click', (e) => {
            if (!fabricSelectWrapper.contains(e.target)) {
                document.getElementById('fabric-options').classList.remove('show');
            }
        });

        const selectCollar = document.getElementById('select-collar');
        const selectPlacket = document.getElementById('select-placket');
        const selectCuff = document.getElementById('select-cuff');
        const selectButtonColor = document.getElementById('select-button-color');
        const toggleWhite = document.getElementById('toggle-white');
        const whiteContrastContainer = document.getElementById('white-contrast-container');

        const fabricTorso = document.getElementById('fabric-torso');
        const fabricPlacket = document.getElementById('fabric-placket');
        const fabricCollar = document.getElementById('fabric-collar');
        const fabricCuff = document.getElementById('fabric-cuff');

        const maskTorso = document.getElementById('mask-torso');
        const maskPlacket = document.getElementById('mask-placket');
        const maskCollar = document.getElementById('mask-collar');
        const maskCuff = document.getElementById('mask-cuff');

        const layerCollar = document.getElementById('layer-collar');
        const layerPlacket = document.getElementById('layer-placket');
        const layerCuff = document.getElementById('layer-cuff');

        const layerWhiteCollar = document.getElementById('layer-white-collar');
        const layerWhiteCuff = document.getElementById('layer-white-cuff');

        const imgPlacketButtons = document.getElementById('img-placket-buttons');
        const tintPlacketButtons = document.getElementById('tint-placket-buttons');
        const imgCuffButtons = document.getElementById('img-cuff-buttons');
        const tintCuffButtons = document.getElementById('tint-cuff-buttons');
        const layerCollarButtons = document.getElementById('layer-collar-buttons');
        const imgCollarButtons = document.getElementById('img-collar-buttons');
        const tintCollarButtons = document.getElementById('tint-collar-buttons');

        function updateVisuals() {
            const fabricUrl = currentFabric;
            const collarUrl = selectCollar.value;
            const placketUrl = selectPlacket.value;
            const cuffUrl = selectCuff.value;
            const buttonColor = selectButtonColor.value;

            // Apply Fabric Pattern
            const bgUrl = \`url('\${fabricUrl}')\`;
            fabricTorso.style.backgroundImage = bgUrl;
            fabricPlacket.style.backgroundImage = bgUrl;
            fabricCollar.style.backgroundImage = bgUrl;
            fabricCuff.style.backgroundImage = bgUrl;

            // Update Image Sources
            layerCollar.src = collarUrl;
            layerCuff.src = cuffUrl;

            // Update Masks
            maskCollar.style.webkitMaskImage = \`url('\${collarUrl}')\`;
            maskCollar.style.maskImage = \`url('\${collarUrl}')\`;

            maskCuff.style.webkitMaskImage = \`url('\${cuffUrl}')\`;
            maskCuff.style.maskImage = \`url('\${cuffUrl}')\`;

            // Placket & Placket Buttons Logic
            if (placketUrl === 'none') {
                layerPlacket.style.display = 'none';
                maskPlacket.style.display = 'none';
                imgPlacketButtons.src = '/images/french_placket_button_png_1771857391259.png';
            } else {
                layerPlacket.style.display = 'block';
                maskPlacket.style.display = 'block';
                layerPlacket.src = placketUrl;
                maskPlacket.style.webkitMaskImage = \`url('\${placketUrl}')\`;
                maskPlacket.style.maskImage = \`url('\${placketUrl}')\`;
                
                if (placketUrl.includes('single_placket')) {
                    imgPlacketButtons.src = '/images/single_placket_button_layout_1771857391259.png';
                } else if (placketUrl.includes('french_placket')) {
                    imgPlacketButtons.src = '/images/french_placket_button_png_1771857391259.png';
                } else if (placketUrl.includes('2_button_polo_placket')) {
                    imgPlacketButtons.src = '/images/2_button_polo_placket_buttons_1771857391259.png';
                }
            }

            // Update button masks based on the button images
            tintPlacketButtons.style.webkitMaskImage = \`url('\${imgPlacketButtons.getAttribute('src')}')\`;
            tintPlacketButtons.style.maskImage = \`url('\${imgPlacketButtons.getAttribute('src')}')\`;

            // Apply Button Colors
            tintPlacketButtons.style.backgroundColor = buttonColor;
            tintCuffButtons.style.backgroundColor = buttonColor;
            tintCollarButtons.style.backgroundColor = buttonColor;

            // Collar Button Logic
            if (collarUrl.includes('button_down_without_button')) {
                layerCollarButtons.style.display = 'block';
            } else {
                layerCollarButtons.style.display = 'none';
            }

            // White Contrast Logic
            const isWhiteFabric = fabricUrl.toLowerCase().includes('white');
            
            if (isWhiteFabric) {
                toggleWhite.checked = false;
                toggleWhite.disabled = true;
                whiteContrastContainer.style.opacity = '0.5';
                state.whiteContrast = false;
            } else {
                toggleWhite.disabled = false;
                whiteContrastContainer.style.opacity = '1';
                state.whiteContrast = toggleWhite.checked;
            }

            if (state.whiteContrast) {
                maskCollar.style.display = 'none';
                maskCuff.style.display = 'none';
                
                layerWhiteCollar.src = collarUrl;
                layerWhiteCuff.src = cuffUrl;
                layerWhiteCollar.style.display = 'block';
                layerWhiteCuff.style.display = 'block';
            } else {
                maskCollar.style.display = 'block';
                maskCuff.style.display = 'block';
                
                layerWhiteCollar.style.display = 'none';
                layerWhiteCuff.style.display = 'none';
            }
        }

        selectCollar.addEventListener('change', updateVisuals);
        selectPlacket.addEventListener('change', updateVisuals);
        selectCuff.addEventListener('change', updateVisuals);
        selectButtonColor.addEventListener('change', updateVisuals);
        toggleWhite.addEventListener('change', updateVisuals);

        function openModal(id) {
            document.getElementById(id).classList.add('active');
        }

        function closeModal(event, id) {
            if (event && event.target !== event.currentTarget && !event.target.classList.contains('modal-close')) return;
            document.getElementById(id).classList.remove('active');
            document.querySelectorAll('.success-msg').forEach(el => el.style.display = 'none');
        }

        function handleFormSubmit(event, successId) {
            event.preventDefault();
            const inputs = event.target.querySelectorAll('input, select');
            
            inputs.forEach(input => {
                if(input.previousElementSibling) {
                    const label = input.previousElementSibling.textContent;
                    state.measurements[label] = input.value;
                }
            });

            const successEl = document.getElementById(successId);
            successEl.style.display = 'block';
            event.target.reset();

            setTimeout(() => {
                closeModal(null, event.target.closest('.modal-overlay').id);
            }, 2000);
        }

        // Run initially
        updateVisuals();
    </script>
</body>
</html>`;

fs.writeFileSync('client/index.html', updatedHtml);
console.log('Saved to client/index.html');
