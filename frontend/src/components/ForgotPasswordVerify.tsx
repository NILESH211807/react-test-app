/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { EyeOffIcon } from "lucide-react";
import { Eye } from 'lucide-react';
import { toast } from "sonner";
import { useForgotPasswordMutation, useResendOTPMutation } from "@/redux/features/api/authSlice";
import { useNavigate } from "react-router-dom";

const otpSchema = z
    .object({
        otp: z.string().length(6, "OTP must be exactly 6 digits"),
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Confirm password is required"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

const ForgotPasswordVerify = ({ email, setIsOtpSent }: { email: string, setIsOtpSent: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const navigate = useNavigate();
    const [timer, setTimer] = useState<number>(60);
    const [isResentOTP, setIsResentOTP] = useState<boolean>(true)

    const otpForm = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const [forgotPasswordMutation, { isLoading: isForgotPasswordLoading }] = useForgotPasswordMutation()
    const [resendOTPMutation, { isLoading: isResendOTPLoading }] = useResendOTPMutation();

    // onSubmit
    async function onSubmit(values: z.infer<typeof otpSchema>) {
        const data = {
            email: email,
            otp: values.otp,
            newPassword: values.newPassword,
        }
        try {
            await forgotPasswordMutation(data).unwrap();
            toast.success("Password changed successfully");
            navigate('/login', { replace: true });
        } catch (err: any) {
            const message = err?.data?.message || "Something went wrong";
            toast.error(message);
        }
    }

    // handleTimer
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
    }, [isResentOTP, timer]);

    // handleResendOTP
    const handleResendOTP = async () => {
        try {
            if (!email) throw new Error("Please enter email");
            await resendOTPMutation({ email, type: "forgot-password" }).unwrap();
            toast.success("OTP resent to your email");
            setTimer(60);
            setIsResentOTP(true);
        } catch (err: any) {
            const message = err?.data?.message || "Something went wrong";
            toast.error(message);
        }
    }

    return (

        <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                        <FormItem className="max-w-sm">
                            <FormLabel>OTP</FormLabel>
                            <FormControl>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        type="text"
                                        placeholder="Enter OTP"
                                    />
                                </InputGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={otpForm.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem className="max-w-sm">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        type={isPasswordVisible ? "text" : "password"}
                                        placeholder="Enter password"
                                    />
                                </InputGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={otpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem className="max-w-sm">
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        id="confirmPassword"
                                        type={isPasswordVisible ? "text" : "password"}
                                        placeholder="Confirm password"
                                    />
                                    <InputGroupAddon align="inline-end" className="cursor-pointer">
                                        {isPasswordVisible ? (
                                            <EyeOffIcon onClick={() => setIsPasswordVisible(!isPasswordVisible)} />
                                        ) : (
                                            <Eye onClick={() => setIsPasswordVisible(!isPasswordVisible)} />
                                        )
                                        }
                                    </InputGroupAddon>
                                </InputGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <div className="flex justify-between">
                    <Button variant="outline" className="mt-2 cursor-pointer" type="button" onClick={() => setIsOtpSent(false)}>
                        Back
                    </Button>
                    <Button variant="outline" disabled={isResentOTP || isResendOTPLoading} className="mt-2 cursor-pointer" type="button" onClick={handleResendOTP}>
                        {isResentOTP ? `Resend in ${timer} seconds` : isResendOTPLoading ? "Loading..." : "Resend OTP"}
                    </Button>
                    <Button disabled={isForgotPasswordLoading || isResendOTPLoading} className="mt-2 cursor-pointer" type="submit">
                        {isForgotPasswordLoading ? "Loading..." : "Verify"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default ForgotPasswordVerify
