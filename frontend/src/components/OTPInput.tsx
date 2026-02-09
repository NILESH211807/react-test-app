/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormField, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FormControl, FormItem, FormLabel } from "./ui/form";
import { toast } from "sonner";
import { useResendOTPMutation, useSignupMutation } from "@/redux/features/api/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type SignupForm = {
    name: string;
    email: string;
    password: string;
}

type OTPInputProps = {
    isOtpSent: boolean;
    setIsOtpSent: React.Dispatch<React.SetStateAction<boolean>>;
    formData: SignupForm;
}


const OTPInput = ({ isOtpSent, setIsOtpSent, formData }: OTPInputProps) => {
    const navigate = useNavigate();

    const formSchema = z.object({
        otp: z.string().length(6, "OTP must be exactly 6 digits"),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: ""
        },
    });
    const [signupMutation, { isLoading }] = useSignupMutation();
    // useResendOTPMutation
    const [resendOTPMutation, { isLoading: isResendOTPLoading }] = useResendOTPMutation();
    const [timer, setTimer] = useState<number>(60);
    const [isResentOTP, setIsResentOTP] = useState<boolean>(true)

    useEffect(() => {
        if (timer > 0 && isResentOTP) {
            const interval = setInterval(() => {
                setTimer(timer - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setIsResentOTP(false);
            setTimer(60);
        }
    }, [timer, isResentOTP])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { otp } = values;

        try {

            if (!otp) throw new Error("Please enter OTP");

            const data = { ...formData, otp }

            await signupMutation(data).unwrap();
            toast.success("Account created successfully");
            navigate('/', { replace: true });
        } catch (err: any) {
            const message = err?.data?.message || "Something went wrong";
            toast.error(message);
        }
    }

    // handleResendOTP
    const handleResendOTP = async () => {
        const { email } = formData;
        try {
            if (!email) throw new Error("Please enter email");
            await resendOTPMutation({ email, type: "signup" }).unwrap();
            toast.success("OTP resent to your email");
            setTimer(60);
            setIsResentOTP(true);
        } catch (err: any) {
            const message = err?.data?.message || "Something went wrong";
            toast.error(message);
        }
    }

    return (
        <Dialog open={isOtpSent} onOpenChange={setIsOtpSent}>
            <DialogContent className="sm:max-w-sm">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl text-center font-semibold">
                                Verification Code
                            </DialogTitle>
                            <DialogDescription className="text-center">
                                Please enter the verification code sent to {formData?.email}
                            </DialogDescription>
                        </DialogHeader>

                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>OTP</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123456" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-between items-center text-sm">
                            {
                                isResentOTP ? (
                                    <p className="text-muted-foreground">Resend code in {timer} seconds</p>
                                ) : (
                                    <>
                                        <p className="text-muted-foreground">Didn't receive the code?</p>
                                        <Button
                                            type="button"
                                            variant="link"
                                            className="p-0 h-auto cursor-pointer font-normal"
                                            onClick={handleResendOTP}
                                        >
                                            {isResendOTPLoading ? "Loading..." : "Resend Code"}
                                        </Button>
                                    </>
                                )
                            }

                        </div>

                        <DialogFooter className="gap-2 sm:gap-5">
                            <DialogClose asChild>
                                <Button disabled={isLoading} type="button" variant="outline" className="flex-1">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button disabled={isLoading} type="submit" className="flex-1">
                                {isLoading ? "Loading..." : "Verify"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default OTPInput;