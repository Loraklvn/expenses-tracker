import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("privacy");
  return {
    title: t("title"),
    description: t("meta_description"),
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-sm text-stone-500 mb-8">
            {t("last_updated", { date: new Date().toLocaleDateString() })}
          </p>

          <div className="prose prose-stone max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">
                {t("section_1_title")}
              </h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                {t("section_1_content")}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">
                {t("section_2_title")}
              </h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                {t("section_2_content")}
              </p>
              <ul className="list-disc list-inside text-stone-700 space-y-2 ml-4">
                <li>{t("section_2_item_1")}</li>
                <li>{t("section_2_item_2")}</li>
                <li>{t("section_2_item_3")}</li>
                <li>{t("section_2_item_4")}</li>
                <li>{t("section_2_item_5")}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">
                {t("section_3_title")}
              </h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                {t("section_3_content")}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">
                {t("section_4_title")}
              </h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                {t("section_4_content")}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">
                {t("section_5_title")}
              </h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                {t("section_5_content")}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">
                {t("section_6_title")}
              </h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                {t("section_6_content")}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">
                {t("section_7_title")}
              </h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                {t("section_7_content")}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">
                {t("section_8_title")}
              </h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                {t("section_8_content")}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">
                {t("section_9_title")}
              </h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                {t("section_9_content")}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">
                {t("section_10_title")}
              </h2>
              <p className="text-stone-700 leading-relaxed">
                {t("section_10_content")}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

