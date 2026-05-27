// =============================================================================
// CONFIG — when you fork this for a new org, edit these three constants.
// =============================================================================

// Get a free key at https://api.imgbb.com/ (sign in → "Get API key").
// Leave as empty string to skip image hosting and embed photos as base64 in the
// signature itself (works in Gmail but inflates signature size to ~30–80 KB).
const IMGBB_API_KEY = 'd15a4067839b0c2854f02a0ad4ced918';

// Default brand color. The visitor can override via the color picker.
const DEFAULT_BRAND = '#6FA88A';

// Default page background. The visitor can override via swatches.
const DEFAULT_PAGE_BG = '#E8F2EB';

// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // ---- Elements --------------------------------------------------------
    const uploadBtn = document.getElementById('upload-btn');
    const photoUpload = document.getElementById('photo-upload');
    const cropModal = document.getElementById('crop-modal');
    const cropImage = document.getElementById('crop-image');
    const cancelCropBtn = document.getElementById('cancel-crop-btn');
    const cropAndUploadBtn = document.getElementById('crop-and-upload-btn');
    const brightnessSlider = document.getElementById('brightness');
    const saturationSlider = document.getElementById('saturation');
    const addLinkBtn = document.getElementById('add-link-btn');
    const messageTextarea = document.getElementById('message');
    const brandColorInput = document.getElementById('brand-color');
    const brandColorHex = document.getElementById('brand-color-hex');
    const bgSwatchesEl = document.getElementById('bg-swatches');
    const form = document.getElementById('signature-form');
    const copyBtn = document.getElementById('copy-btn');
    const desktopPreview = document.getElementById('desktop-preview');
    const mobilePreview = document.getElementById('mobile-preview');
    let cropper;

    // ---- Icons (Lucide path data; rasterized to PNG so email clients render them) ----
    const ICON_SVG = {
        mail:      `<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`,
        phone:     `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>`,
        link:      `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>`,
        mapPin:    `<path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>`,
        linkedin:  `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>`,
        facebook:  `<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>`,
        instagram: `<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>`,
    };
    let iconCache = { brand: {}, light: {} };
    const MOBILE_ICON_COLOR = '#FFFFFF';

    function renderIconDataURI(svgInner, color, size, strokeWidth = 2) {
        const px = size * 3;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${svgInner}</svg>`;
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = px;
                canvas.height = px;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, px, px);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => resolve('');
            img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
        });
    }

    async function rebuildIconCache(color) {
        const sizes = { mail: 14, phone: 14, link: 14, mapPin: 14, linkedin: 17, facebook: 17, instagram: 17 };
        const buildSet = async (col, strokeWidth) => {
            const entries = await Promise.all(
                Object.entries(ICON_SVG).map(async ([name, inner]) => {
                    const uri = await renderIconDataURI(inner, col, sizes[name], strokeWidth);
                    return [name, uri];
                })
            );
            return Object.fromEntries(entries);
        };
        const [brandSet, lightSet] = await Promise.all([
            buildSet(color, 2),
            buildSet(MOBILE_ICON_COLOR, 2.25),
        ]);
        iconCache.brand = brandSet;
        iconCache.light = lightSet;
    }

    // ---- Theme: brand color + page background ---------------------------
    function setBrandColor(hex) {
        document.documentElement.style.setProperty('--brand', hex);
        brandColorInput.value = hex;
        brandColorHex.value = hex.toUpperCase();
    }

    function setPageBg(hex) {
        document.documentElement.style.setProperty('--page-bg', hex);
        document.querySelectorAll('.bg-swatch').forEach((el) => {
            el.classList.toggle('is-active', el.dataset.bg.toLowerCase() === hex.toLowerCase());
        });
    }

    setBrandColor(DEFAULT_BRAND);
    setPageBg(DEFAULT_PAGE_BG);

    brandColorInput.addEventListener('input', async (e) => {
        const hex = e.target.value;
        setBrandColor(hex);
        await rebuildIconCache(hex);
        updatePreview();
    });

    brandColorHex.addEventListener('change', async (e) => {
        const hex = e.target.value.trim();
        if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
        setBrandColor(hex);
        await rebuildIconCache(hex);
        updatePreview();
    });

    bgSwatchesEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.bg-swatch');
        if (!btn) return;
        setPageBg(btn.dataset.bg);
    });

    // ---- Gmail "how to" modal -------------------------------------------
    const gmailModal = document.getElementById('gmail-modal');
    const gmailStep = document.getElementById('gmail-step');
    const gmailDots = document.getElementById('gmail-dots');
    const gmailNext = document.getElementById('gmail-next');
    const gmailPrev = document.getElementById('gmail-prev');
    const gmailClose = document.getElementById('gmail-close');
    const howToBtn = document.getElementById('how-to-btn');

    const gmailSteps = [
        {
            title: 'Step 1 — Open Gmail Settings',
            content: 'Open Gmail in your browser. Click the gear icon (top-right) and choose "See all settings".',
            gif: 'https://techbbq.dk/wp-content/uploads/2025/10/1stepsignature.gif',
        },
        {
            title: 'Step 2 — Create a new signature',
            content: 'Scroll to the "Signature" section. Click "+ Create new", give your signature a name, and confirm.',
            gif: 'https://techbbq.dk/wp-content/uploads/2025/10/2stepsignature.gif',
        },
        {
            title: 'Step 3 — Paste your signature',
            content: 'Click "Copy Signature" on this page. Then paste (Ctrl+V / Cmd+V) into the empty signature field in Gmail. Set it as the default for new emails and replies if you like.',
            gif: 'https://techbbq.dk/wp-content/uploads/2025/10/3stepsignature.gif',
        },
        {
            title: 'Step 4 — Save and test',
            content: 'Click "Save Changes" at the bottom of the Gmail settings page, then compose a new email. Your signature should appear automatically.',
            gif: 'https://techbbq.dk/wp-content/uploads/2025/10/4stepsignature.gif',
        },
    ];
    let gmailCurrentStep = 0;

    function showGmailStep(i) {
        const step = gmailSteps[i];
        gmailStep.innerHTML = `
            ${step.gif ? `<img src="${step.gif}" alt="${step.title}" style="width: 100%; border-radius: 10px; border: 1px solid var(--line); margin-bottom: 12px;">` : ''}
            <h3 class="text-base font-semibold" style="color: var(--brand);">${step.title}</h3>
            <p class="text-sm leading-relaxed" style="color: var(--ink);">${step.content}</p>
        `;
        gmailDots.innerHTML = gmailSteps.map((_, k) =>
            `<div class="w-2 h-2 rounded-full" style="background:${k === i ? 'var(--brand)' : 'var(--line)'};"></div>`
        ).join('');
        gmailPrev.classList.toggle('hidden', i === 0);
        gmailNext.textContent = i === gmailSteps.length - 1 ? 'Finish' : 'Next';
    }

    gmailNext.addEventListener('click', () => {
        if (gmailCurrentStep < gmailSteps.length - 1) {
            gmailCurrentStep++;
            showGmailStep(gmailCurrentStep);
        } else {
            gmailModal.classList.add('hidden');
            gmailCurrentStep = 0;
        }
    });
    gmailPrev.addEventListener('click', () => { if (gmailCurrentStep > 0) { gmailCurrentStep--; showGmailStep(gmailCurrentStep); } });
    gmailClose.addEventListener('click', () => { gmailModal.classList.add('hidden'); gmailCurrentStep = 0; });
    gmailModal.addEventListener('click', (e) => { if (e.target === gmailModal) { gmailModal.classList.add('hidden'); gmailCurrentStep = 0; } });
    howToBtn.addEventListener('click', () => { gmailCurrentStep = 0; showGmailStep(0); gmailModal.classList.remove('hidden'); });

    // ---- Photo upload ---------------------------------------------------
    uploadBtn.addEventListener('click', () => photoUpload.click());

    addLinkBtn.addEventListener('click', () => {
        const linkText = prompt('Enter the text to display:');
        if (!linkText) return;
        const linkUrl = prompt('Enter the URL:');
        if (!linkUrl) return;
        const linkHtml = `<a href="${linkUrl}" style="color: var(--brand) !important; text-decoration: underline;">${linkText}</a>`;
        const cursorPos = messageTextarea.selectionStart;
        const before = messageTextarea.value.substring(0, cursorPos);
        const after = messageTextarea.value.substring(cursorPos);
        messageTextarea.value = before + linkHtml + after;
        updatePreview();
    });

    photoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            cropImage.src = ev.target.result;
            cropModal.classList.remove('hidden');
            cropper = new Cropper(cropImage, { aspectRatio: 1, viewMode: 1, background: false });
        };
        reader.readAsDataURL(file);
        brightnessSlider.value = 100;
        saturationSlider.value = 100;
    });

    const applyImageFilters = () => {
        if (!cropper) return;
        const cropperImage = cropModal.querySelector('.cropper-view-box img');
        if (cropperImage) {
            cropperImage.style.filter = `brightness(${brightnessSlider.value}%) saturate(${saturationSlider.value}%)`;
        }
    };
    brightnessSlider.addEventListener('input', applyImageFilters);
    saturationSlider.addEventListener('input', applyImageFilters);

    cancelCropBtn.addEventListener('click', () => {
        cropModal.classList.add('hidden');
        if (cropper) cropper.destroy();
    });

    cropAndUploadBtn.addEventListener('click', () => {
        if (!cropper) return;
        cropAndUploadBtn.textContent = 'Uploading...';
        cropAndUploadBtn.disabled = true;

        const cropped = cropper.getCroppedCanvas({ width: 200, height: 200 });
        const final = document.createElement('canvas');
        final.width = 200;
        final.height = 200;
        const ctx = final.getContext('2d');
        ctx.filter = `brightness(${brightnessSlider.value}%) saturate(${saturationSlider.value}%)`;
        ctx.drawImage(cropped, 0, 0);

        final.toBlob((blob) => {
            uploadPhoto(blob).then((url) => {
                document.getElementById('photo').value = url;
                updatePreview();
            }).catch((err) => {
                console.error(err);
                alert('Upload failed: ' + err.message + '\n\nFalling back to embedding the photo directly in the signature.');
                document.getElementById('photo').value = final.toDataURL('image/png');
                updatePreview();
            }).finally(() => {
                cropModal.classList.add('hidden');
                if (cropper) cropper.destroy();
                cropAndUploadBtn.textContent = 'Crop & Upload';
                cropAndUploadBtn.disabled = false;
            });
        }, 'image/png');
    });

    async function uploadPhoto(blob) {
        if (!IMGBB_API_KEY) {
            // No host configured → embed as base64 data URI inside the signature.
            return await blobToDataURL(blob);
        }
        const fd = new FormData();
        fd.append('image', blob);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: fd });
        if (!res.ok) throw new Error(`imgbb returned ${res.status}`);
        const json = await res.json();
        if (!json?.data?.url) throw new Error('No URL in imgbb response');
        return json.data.url;
    }

    function blobToDataURL(blob) {
        return new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result);
            r.onerror = reject;
            r.readAsDataURL(blob);
        });
    }

    // ---- Signature rendering --------------------------------------------
    const updatePreview = () => {
        const v = (id) => document.getElementById(id).value;
        const brand = brandColorInput.value;

        const name = v('name');
        const jobTitle = v('job-title');
        const company = v('company');
        const email = v('email');
        const phone = v('phone');
        const website = v('website');
        const address = v('address');
        const personalLinkedin = v('personal-linkedin');
        const linkedin = v('linkedin');
        const facebook = v('facebook');
        const instagram = v('instagram');
        const photo = v('photo');
        const message = v('message');

        const buildSig = (textColor, mutedColor, dividerColor, icons) => {
            const photoBorderColor = brand;
            const titleLine = [jobTitle, company].filter(Boolean).join(' · ');

            const row = (iconUri, content) => `
                <p style="margin: 3px 0; font-family: Verdana, sans-serif; font-size: 11px; color: ${textColor}; line-height: 16px; white-space: nowrap;"><img src="${iconUri}" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 6px;">${content}</p>`;

            const placeholderBg = textColor === '#f1f1f1' ? '#3a3a3a' : '#EEEEEE';
            const placeholderText = textColor === '#f1f1f1' ? '#aaa' : '#888';

            return `
            <table style="font-family: Verdana, sans-serif; font-size: 12px; color: ${textColor}; border-collapse: collapse;">
                <tr>
                    <td style="width: 120px; vertical-align: middle; text-align: center; padding-right: 14px;">
                        ${photo
                            ? `<img src="${photo}" alt="${name}" style="width: 100px; height: 100px; border-radius: 8px; border: 1px solid ${photoBorderColor}; object-fit: cover; display: block; margin: 0 auto 6px;">`
                            : `<div style="width: 100px; height: 100px; background-color: ${placeholderBg}; display: flex; align-items: center; justify-content: center; margin: 0 auto 6px; border: 1px solid ${dividerColor}; border-radius: 8px;"><span style="font-size: 10px; color: ${placeholderText}; text-align: center; font-family: Verdana, sans-serif; padding: 5px;">Your Photo</span></div>`}
                        ${personalLinkedin ? `<a href="${personalLinkedin}" style="color: ${textColor} !important; text-decoration: underline; font-size: 10px; font-family: Verdana, sans-serif; display: block; text-align: center;">Let's connect</a>` : ''}
                    </td>
                    <td style="vertical-align: top; padding-left: 14px; border-left: 2px solid ${brand};">
                        <p style="margin: 0; font-family: Verdana, sans-serif; font-size: 18px; font-weight: bold; line-height: 1.1; color: ${textColor};">${name || 'Your Name'}</p>
                        ${titleLine ? `<p style="margin: 3px 0 0 0; font-family: Verdana, sans-serif; font-size: 12px; line-height: 1.2; color: ${textColor};">${titleLine}</p>` : ''}
                        <hr style="border: none; height: 1px; background-color: ${brand}; margin: 9px 0; max-width: 220px;">
                        <div>
                            ${email ? row(icons.mail, `<a href="mailto:${email}" style="color: ${textColor} !important; text-decoration: underline; font-family: Verdana, sans-serif;">${email}</a>`) : ''}
                            ${phone ? row(icons.phone, `<a href="tel:${phone}" style="color: ${textColor} !important; text-decoration: underline; font-family: Verdana, sans-serif;">${phone}</a>`) : ''}
                            ${website ? row(icons.link, `<a href="${website}" style="color: ${textColor} !important; text-decoration: underline; font-family: Verdana, sans-serif;">${website.replace(/^https?:\/\//, '')}</a>`) : ''}
                            ${address ? row(icons.mapPin, `<span style="color: ${textColor};">${address}</span>`) : ''}
                        </div>
                        ${(linkedin || facebook || instagram) ? `<p style="margin: 10px 0 0 0;">
                            ${linkedin  ? `<a href="${linkedin}"  style="margin-right: 5px; display: inline-block;"><img src="${icons.linkedin}"  width="17" height="17" style="display: block;"></a>` : ''}
                            ${facebook  ? `<a href="${facebook}"  style="margin-right: 5px; display: inline-block;"><img src="${icons.facebook}"  width="17" height="17" style="display: block;"></a>` : ''}
                            ${instagram ? `<a href="${instagram}" style="display: inline-block;"><img src="${icons.instagram}" width="17" height="17" style="display: block;"></a>` : ''}
                        </p>` : ''}
                        ${message ? `<p style="margin-top: 10px; font-style: italic; font-family: Verdana, sans-serif; font-size: 10px; color: ${mutedColor}; max-width: 260px;">${message}</p>` : ''}
                    </td>
                </tr>
            </table>`;
        };

        desktopPreview.innerHTML = buildSig('#1F2A24', '#6B7470', 'rgba(0,0,0,0.10)', iconCache.brand);
        mobilePreview.innerHTML  = buildSig('#f1f1f1', '#bcbcbc', 'rgba(255,255,255,0.15)', iconCache.light);

        copyBtn.classList.toggle('hidden', !(name || jobTitle || email));
    };

    form.addEventListener('input', updatePreview);

    copyBtn.addEventListener('click', () => {
        const html = desktopPreview.innerHTML;
        try {
            const blob = new Blob([html], { type: 'text/html' });
            const item = new ClipboardItem({ 'text/html': blob });
            navigator.clipboard.write([item]).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = 'Copy Signature'; }, 1800);
            });
        } catch (e) {
            navigator.clipboard.writeText(html).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = 'Copy Signature'; }, 1800);
            });
        }
    });

    // ---- Boot -----------------------------------------------------------
    rebuildIconCache(DEFAULT_BRAND).then(updatePreview);
});
