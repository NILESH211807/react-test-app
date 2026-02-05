import * as yup from 'yup';

export const signupSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .required("Name is required")
        .min(3, "Name must be at least 3 characters")
        .max(20, "Name must be less than 20 characters")
        .matches(/^[a-zA-Z ]+$/, "Name must be alphabets and spaces")
    ,
    email: yup
        .string()
        .required("Email is required").trim()
        .lowercase()
        .email('Email must be a valid email address'),
    password: yup
        .string()
        .trim()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be less than 20 characters"),
});

// login schema

export const loginSchema = yup.object().shape({
    email: yup
        .string()
        .required("Email is required").trim()
        .lowercase()
        .email('Email must be a valid email address'),

    password: yup
        .string()
        .trim()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be less than 20 characters"),
})


