import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { signinSchema } from "@/lib/schema/signinSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router";


const Login = () => {
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  
  async function onSubmit(values: z.infer<typeof signinSchema>) {
    // console.log(values);
    try {
      const response = await api.post("/auth/login", values);
      console.log(response.data);

      if (response.data.success) {
        toast.success("Login successful", {
          description: "Welcome back!",
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/");
      }

    } catch (error: any) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.error("Login failed", {
        description: error.response?.data?.message || "An error occurred",
      });
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black border border-white/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-white text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-white/70 text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="bg-black border-white/20 text-white focus-visible:ring-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter a password"
                        className="bg-black border-white/20 text-white focus-visible:ring-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-white/90"
              >
                Sign in
              </Button>
              <p className="text-white/70 text-center">
                Not registered yet?{" "}
                <a href="/signup" className="text-white underline">
                  Create an account
                </a>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
