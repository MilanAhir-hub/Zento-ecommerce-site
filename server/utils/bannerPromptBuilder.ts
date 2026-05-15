export interface BannerPromptInput {
    title: string;
    subtitle?: string;
    category: string;
    subcategory?: string;
    discountType?: string;
    discountValue?: string | number;
    startDate?: string;
    endDate?: string;
    theme?: string;
    customPrompt?: string;
}

const formatOffer = (discountType?: string, discountValue?: string | number): string | null => {
    if (discountValue === undefined || discountValue === null || discountValue === "") {
        return null;
    }

    const normalizedValue = String(discountValue).trim();
    if (!normalizedValue) {
        return null;
    }

    return discountType === "Flat"
        ? `Flat discount of ${normalizedValue}`
        : `${normalizedValue}% discount`;
};

const formatCampaignWindow = (startDate?: string, endDate?: string): string | null => {
    if (!startDate && !endDate) {
        return null;
    }

    if (startDate && endDate) {
        return `${startDate} to ${endDate}`;
    }

    return startDate || endDate || null;
};

const getThemeDirection = (theme?: string): string => {
    if (theme === "dark") {
        return "Luxury dark editorial mood, rich shadows, crisp highlights, premium depth, and elegant contrast.";
    }

    return "Bright modern commercial mood, soft natural light, premium clean styling, airy depth, and polished surfaces.";
};

export const buildBannerImagePrompt = (input: BannerPromptInput): string => {
    const offer = formatOffer(input.discountType, input.discountValue);
    const campaignWindow = formatCampaignWindow(input.startDate, input.endDate);
    const categoryLine = input.subcategory
        ? `${input.category} > ${input.subcategory}`
        : input.category;
    const customPrompt = input.customPrompt?.trim();

    return [
        "Create a premium ecommerce homepage banner background image for a vendor storefront.",
        `Campaign concept for visual inspiration only, never as rendered text: ${input.title.trim()}.`,
        input.subtitle?.trim()
            ? `Supporting concept for visual inspiration only, never as rendered text: ${input.subtitle.trim()}.`
            : null,
        `Product category focus: ${categoryLine}.`,
        offer ? `Promotional context: ${offer}.` : null,
        campaignWindow ? `Campaign timing context: ${campaignWindow}.` : null,
        `Visual direction: ${getThemeDirection(input.theme)}.`,
        "Composition requirements:",
        "- Wide cinematic 21:9 banner composition suitable for a storefront hero section.",
        "- Leave clean negative space for headline, subtitle, CTA, and offer overlays.",
        "- Do not generate any text, letters, numbers, price tags, logos, watermarks, or UI elements inside the image.",
        "- Keep the layout uncluttered, premium, conversion-focused, and brand-safe.",
        "- Use realistic ad photography or premium brand illustration styling based on the campaign concept.",
        "- Make the image high quality, sharp, and ready for ecommerce use.",
        customPrompt ? `Vendor direction: ${customPrompt}.` : null,
    ]
        .filter(Boolean)
        .join("\n");
};
