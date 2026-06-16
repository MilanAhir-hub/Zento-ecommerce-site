import { Link } from "react-router-dom";

const AboutSection = () => {
    return (
        <section className="w-full py-20 bg-white">
            <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    
                    {/* Left: Premium Lifestyle Image */}
                    <div className="relative overflow-hidden bg-stone-100 aspect-[4/3] lg:aspect-[3/4] max-h-[550px]">
                        <img
                            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80"
                            alt="Novara Atelier"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Right: Copy & Branding */}
                    <div className="flex flex-col justify-center">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#767676] mb-4">
                            Our Philosophy
                        </span>
                        
                        <h2 className="text-[26px] md:text-[32px] font-medium tracking-[0.05em] text-[#000000] uppercase mb-6 leading-[1.2]">
                            Refined Basics.<br />
                            Timeless Silhouettes.
                        </h2>
                        
                        <p className="text-[14px] text-[#222222] font-medium leading-relaxed mb-8 max-w-md">
                            Novara is a curated fashion boutique dedicated to minimalist editorial luxury. We believe in building a wardrobe centered on quality craftsmanship, structural alignment, and premium textures. 
                        </p>

                        <p className="text-[14px] text-[#767676] font-medium leading-relaxed mb-8 max-w-md">
                            Every garment is chosen with a conscious emphasis on architectural cuts and effortless integration, acting as a quiet frame for your personal expression.
                        </p>

                        <div className="flex">
                            <Link
                                to="/about"
                                className="text-[13px] font-semibold uppercase tracking-[0.1em] text-black underline underline-offset-8 decoration-black/30 hover:decoration-black transition-colors"
                            >
                                Explore Our Story
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutSection;
