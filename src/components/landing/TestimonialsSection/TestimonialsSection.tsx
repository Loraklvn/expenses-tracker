import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";

export default function TestimonialsSection() {
  const t = useTranslations("landing.testimonials");

  const testimonials = [
    {
      name: t("sarah.name"),
      role: t("sarah.role"),
      avatar: "/professional-woman-headshot.png",
      content: t("sarah.content"),
      rating: 5,
    },
    {
      name: t("james.name"),
      role: t("james.role"),
      avatar: "/asian-man-professional-headshot.png",
      content: t("james.content"),
      rating: 5,
    },
    {
      name: t("emily.name"),
      role: t("emily.role"),
      avatar: "/latina-entrepreneur-headshot.png",
      content: t("emily.content"),
      rating: 5,
    },
  ];
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-stone-100/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="border border-stone-200/50 bg-white rounded-xl p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-emerald-600 text-emerald-600"
                  />
                ))}
              </div>
              <p className="text-stone-900 mb-6">{`"${testimonial.content}"`}</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-stone-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-stone-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

