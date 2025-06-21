import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const t = await getTranslations("auth");
  const params = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t("something_went_wrong")}</CardTitle>
      </CardHeader>
      <CardContent>
        {params?.error ? (
          <p className="text-sm text-muted-foreground">
            {t("code_error", { code: params.error })}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("unspecified_error")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
