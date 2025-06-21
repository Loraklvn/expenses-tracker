import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Page() {
  const t = await getTranslations("auth");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {t("thank_you_for_signing_up")}
        </CardTitle>
        <CardDescription>{t("check_your_email_to_confirm")}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {t("youve_successfully_signed_up")}.{" "}
          {t("please_check_your_email_to_confirm")}
        </p>

        {/* Go to sign in page after confirming email */}
        <p className="text-sm text-muted-foreground">
          {t("after_confirming_your_email")}{" "}
          {t("you_can_sign_in_to_your_account")}
        </p>

        <Link
          href="/auth/login"
          className="mt-4 text-center block text-sm text-muted-foreground underline underline-offset-4"
        >
          <Button>{t("go_to_sign_in")}</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
