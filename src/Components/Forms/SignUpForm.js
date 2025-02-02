import React from "react";
import TextField from "../UI/TextField/TextField";

import { Formik, Form } from "formik";
import * as Yup from "yup";

function SignUpForm(props) {
    // establish the error checking rules and messages with YUP
    const validate = Yup.object({
        firstName: Yup.string()
            .min(2, "Must be 2 chacters or greater")
            .max(15, "Must be 15 characters or less")
            .required("Required"),
        lastName: Yup.string()
            .min(2, "Must be 2 chacters or greater")
            .max(20, "Must be 20 characters or less")
            .required("Required"),
        email: Yup.string()
            .email("Email is invalid")
            .required("Email is required"),
        password: Yup.string()
            .min(3, "Password must be at least 3 characters or more")
            .required("Password is required"),
        confirmPassword: Yup.string()
            // use oneOf Yup.ref to check if hte above password is the same
            .oneOf([Yup.ref("password"), null], "Password must match")
            .required("Confirm password is required"),
    });

    return (
        // set the initial values to ""
        <Formik
            initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
            }}
            // call the function to validate the inputed values
            validationSchema={validate}
            // need to do something e.g. insert into DB when we submit
            onSubmit={(values) => {
                console.log(values);
            }}
        >
            {(formik) => (
                <div>
                    <h1 className="my-4 font-weight-bold-display-4">Sign Up</h1>
                    {/* print out hte values of the inputted info */}
                    {/* {console.log("The form values are: ", formik.values)} */}
                    <Form>
                        <TextField
                            label="First Name"
                            name="firstName"
                            type="text"
                        />
                        <TextField
                            label="Last Name"
                            name="lastName"
                            type="text"
                        />
                        <TextField label="Email" name="email" type="email" />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                        />
                        <TextField
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                        />
                        <button className="btn btn-dark mt-3" type="submit">
                            Register
                        </button>

                        <button
                            className="btn btn-danger mt-3 ml-3 "
                            type="reset"
                        >
                            Reset
                        </button>
                    </Form>
                </div>
            )}
        </Formik>
    );
}

export default SignUpForm;
