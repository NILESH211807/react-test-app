/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useChangePasswordMutation } from "@/redux/features/api/userSlice"
import { toast } from "sonner"
import { useState } from "react"
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

const changePasswordSchema = z.object({
    currentPassword: z.string().nonempty("Current password is required")
        .min(6, "Current password must be at least 6 characters"),
    newPassword: z.string().nonempty("New password is required")
        .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
}).refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password cannot be the same as current password",
    path: ["newPassword"],
});

type pwdVisibility = {
    isVisibleCurrentPassword: boolean;
    isVisibleNewPassword: boolean;
    isVisibleConfirmPassword: boolean;
}

const ChangePasswordSettings = () => {

    const [changePasswordMutation, { isLoading: isChangePasswordLoading }] = useChangePasswordMutation()

    const form = useForm<z.infer<typeof changePasswordSchema>>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const [formValues, setFormValues] = useState<pwdVisibility>({
        isVisibleCurrentPassword: false,
        isVisibleNewPassword: false,
        isVisibleConfirmPassword: false,
    })

    async function onSubmit(values: z.infer<typeof changePasswordSchema>) {

        const data = {
            oldPassword: values.currentPassword,
            newPassword: values.newPassword,
        }

        try {
            await changePasswordMutation(data).unwrap();
            toast.success("Password changed successfully");
        } catch (err: any) {
            const message = err?.data?.message || "Something went wrong";
            toast.error(message);
        }
    }

    // handleVisiblePassword
    const handleVisiblePassword = (type: keyof pwdVisibility) => {
        setFormValues(prev => ({
            ...prev,
            [type]: !prev[type]
        }))
    }

    return (
        <Card className="shadow-none bg-transparent border-t border-l-transparent border-b-transparent border-r-transparent max-w-3xl rounded-none">
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Change your password.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-6">
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="currentPassword"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Current Password</FormLabel>
                                            <FormControl>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        {...field}
                                                        type={formValues.isVisibleCurrentPassword ? "text" : "password"}
                                                        placeholder="Enter current password"
                                                    />
                                                    <InputGroupAddon align="inline-end" className="cursor-pointer">
                                                        <div onClick={() => handleVisiblePassword("isVisibleCurrentPassword")}>
                                                            {formValues.isVisibleCurrentPassword ? <EyeOffIcon size={20} /> : <Eye size={20} />}
                                                        </div>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* New Password */}
                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        {...field}
                                                        type={formValues.isVisibleNewPassword ? "text" : "password"}
                                                        placeholder="Enter new password"
                                                    />
                                                    <InputGroupAddon align="inline-end" className="cursor-pointer">
                                                        <div onClick={() => handleVisiblePassword("isVisibleNewPassword")}>
                                                            {formValues.isVisibleNewPassword ? <EyeOffIcon size={20} /> : <Eye size={20} />}
                                                        </div>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Confirm Password */}
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        {...field}
                                                        type={formValues.isVisibleConfirmPassword ? "text" : "password"}
                                                        placeholder="Confirm new password"
                                                    />
                                                    <InputGroupAddon align="inline-end" className="cursor-pointer">
                                                        <div onClick={() => handleVisiblePassword("isVisibleConfirmPassword")}>
                                                            {formValues.isVisibleConfirmPassword ? <EyeOffIcon size={20} /> : <Eye size={20} />}
                                                        </div>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="pt-4 border-t flex justify-end">
                            <Button type="submit" disabled={isChangePasswordLoading} className="min-w-[120px]">
                                {isChangePasswordLoading ? "Updating..." : "Update Password"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default ChangePasswordSettings;