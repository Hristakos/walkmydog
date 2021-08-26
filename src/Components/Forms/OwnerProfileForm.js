import React, { useContext } from "react";
import "./OwnerProfileForm.css";
import TextField from "../UI/TextField/TextField";
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";

import useApi from "../../hooks/useApi";
import ownersApi from "../../api/owners";
import dogsApi from "../../api/dogs";

import AuthContext from "../../context/authContext";
import jwtService from "../../storage/jwt";
import ProfileRedirect from "./ProfileRedirect";

import helpers from "../../Helpers/convertDateTime";

function OwnerProfileForm(props) {
    const { setUser, user } = useContext(AuthContext);
    // const { request: getOwners } = useApi(ownersApi.getOwners);
    const { request: getOwner } = useApi(ownersApi.getOwner);

    const { request: updateOwner } = useApi(ownersApi.updateOwner);
    const { request: insertDog } = useApi(dogsApi.insertDog);

    const { request: getOwnerFromCredentialByEmail } = useApi(
        ownersApi.getOwnerFromCredentialByEmail
    );

    const { request: updateOwnerProfile } = useApi(
        ownersApi.updateOwnerProfile
    );

    // user object has keys: email, firsntame, hasProfile, id, lastname, type
    // console.log("GLEN THE USER TOKEN INFO IS: ", user);

    // This function allows a user who has signed up as a DOG OWNER to complete their enrollment by providing
    // their personal, bank account and dog details.
    // If the form is valid, this information is then updated in the OWNER, DOG and CREDETIAL tables
    const updatedOwner = async (formData) => {
        // 1.0 Convert the DOB field from AUS format to US format to suit Postgress.
        formData.dob = helpers.formatAusDateToUSDate(formData.dob);

        // create an entire data object taht will be used to store both Owner and Dog Info Objects
        let ownerDataObject = {};

        try {
            // console.log("FORM DATA is:", formData);
            console.log("USER is", user);

            // DOG INFO PART
            // 1.0 Obtain owner information from owner table based on 'user' TOKEN credential_id. This is required so we can insert the OWNER_ID into the DOG TABLE. e.g. map a dog to their owner_id
            const ownerObj = await getOwner(user.id);

            if (ownerObj.data.owner.length === 0) {
                console.log("Failed to obain the owner information");
            }

            // 2.0 Get all the infromation for the ownerDataObj.
            ownerDataObject = {
                ...formData,
                ...user,
                owner_id: ownerObj.data.owner[0].owner_id,
            };

            const response = await updateOwnerProfile({
                profile: ownerDataObject,
            });

            console.log("WTF WTF WTF", response);

            // GET JWT TOKEN FROM RESPONSE AND DECODE TO USER OBJECT. IF NO TOKEN RETURNS NULL;
            setUser(jwtService.getUserFromResponseToken(response));
        } catch (error) {
            console.log("ownerProfileForm -> updatedOwner()", error);
        }
    };

    // implement Yup error handling
    const validate = Yup.object().shape({
        firstname: Yup.string()
            .max(20, "Must be 20 characters or less")
            .required("Required"),
        lastname: Yup.string()
            .max(20, "Must be 20 characters or less")
            .required("Required"),
        streetAddress: Yup.string()
            .max(50, "Must be 50 characters or less")
            .required("Required"),
        suburb: Yup.string()
            .max(50, "Must be 50 characters or less")
            .required("Required"),
        postcode: Yup.number().min(4, "Must be 4 digits").required("Required"),
        mobile: Yup.string()
            .min(10, "Mobile number must be 10 digits")
            .max(10, "Mobile number must be 10 digits")
            .required("Required"),
        dob: Yup.string().required("Required"),
        driverLicence: Yup.string()
            .min(10, "Driver Licence must be 10 digits")
            .required("Required"),
        bankName: Yup.string()
            .max(20, "Bank name must be <= 20 digits")
            .required("Required"),
        BSB: Yup.string()
            .max(6, "BSB must be <= 6 digits")
            .required("Required"),
        accountNumber: Yup.string()
            .max(10, "Account Number must be <= 10 digits")
            .required("Required"),
        acceptTerms: Yup.bool().oneOf([true], "Accept Terms and Conditions"),
        dogName: Yup.string()
            .min(2, "Dog name must be >= 2 letters")
            .required("Required"),
        dogBreed: Yup.string()
            .min(2, "Dog name must be >= 2 letters")
            .required("Required"),
        dogSize: Yup.string().required("Please select your dog size"),
        requiresLeash: Yup.string().required(
            "Yes or No: Does your dog require an always on leash?"
        ),
    });
    return (
        <>
            <ProfileRedirect />
            <Formik
                initialValues={{
                    firstname: user.firstname,
                    lastname: user.lastname,
                    streetAddress: "",
                    suburb: "",
                    postcode: "",
                    mobile: "",
                    dob: "",
                    driverLicence: "",
                    bankName: "",
                    BSB: "",
                    accountNumber: "",
                    acceptTerms: false,
                    dogName: "",
                    dogBreed: "",
                    dogSize: "",
                    requiresLeash: "",
                }}
                // validate the input fields to the schema above
                validationSchema={validate}
                // onSubmit={(values) => console.log(values)}
                // onSubmit={async () => {
                //     await getOwners();
                // }}
                onSubmit={async (fields) => {
                    try {
                        // console.log("Fields are: ", fields);
                        // need to update the owner table. NOTE: RATING and MEMBERHSIP_ACTIVE are hardcode in the SQL directly
                        const response = await updatedOwner(fields);
                    } catch (error) {}
                }}
            >
                {(formik) => (
                    <div>
                        <Form>
                            <div className="owner-form-container">
                                <section>
                                    <div className="owner-profile-form-container">
                                        <h1 className="owner-profile-form-heading">
                                            Owner Details
                                        </h1>
                                        <div className="owner-profile-form-field-col-1">
                                            <TextField
                                                // label="Firstname"
                                                name="firstname"
                                                type="text"
                                                placeholder="Firstname"
                                            />
                                        </div>

                                        <div className="owner-profile-form-field-col-2">
                                            <TextField
                                                // label="Lastname"
                                                name="lastname"
                                                type="text"
                                                placeholder="Lastname"
                                            />
                                        </div>

                                        <div className="owner-profile-form-field-2-col-span">
                                            <TextField
                                                // label="Street Address"
                                                name="streetAddress"
                                                type="text"
                                                placeholder="Street Address"
                                            />
                                        </div>

                                        <div className="owner-profile-form-field-col-1">
                                            <TextField
                                                // label="Suburb"
                                                name="suburb"
                                                type="text"
                                                placeholder="Suburb"
                                            />
                                        </div>

                                        <div className="owner-profile-form-field-col-2">
                                            <TextField
                                                // label="Postcode"
                                                name="postcode"
                                                type="number"
                                                placeholder="Postcode"
                                            />
                                        </div>

                                        <div className="owner-profile-form-field-col-1">
                                            <TextField
                                                // label="Mobile"
                                                name="mobile"
                                                type="text"
                                                placeholder="Mobile #"
                                            />
                                        </div>

                                        <div className="owner-profile-form-field-col-2">
                                            <TextField
                                                // label="DOB"
                                                name="dob"
                                                type="date"
                                                placeholder="DOB: DD-MM-YYYY"
                                            />
                                        </div>

                                        <div className="owner-profile-form-field-col-1">
                                            <TextField
                                                // label="Driver Licence No:"
                                                name="driverLicence"
                                                type="text"
                                                placeholder="Driver Licence #"
                                            />
                                        </div>
                                    </div>

                                    <div className="owner-profile-form-container">
                                        <h1 className="owner-profile-form-heading">
                                            Bank Details
                                        </h1>
                                        <div className="owner-profile-form-field-2-col-span">
                                            <TextField
                                                // label="Bank Name"
                                                name="bankName"
                                                type="text"
                                                placeholder="Bank Name"
                                            />
                                        </div>
                                        <div className="walker-profile-form-field-col-1">
                                            <TextField
                                                // label="BSB"
                                                name="BSB"
                                                type="text"
                                                placeholder="BSB #"
                                            />
                                        </div>
                                        <div className="walker-profile-form-field-col-2">
                                            <TextField
                                                // label="Account No:"
                                                name="accountNumber"
                                                type="text"
                                                placeholder="Account Number"
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <div className="owner-profile-form-container">
                                        <h1 className="owner-profile-form-heading">
                                            Dog Details
                                        </h1>

                                        <div className="owner-profile-form-field-col-1">
                                            <TextField
                                                // label="Dog Name"
                                                name="dogName"
                                                type="text"
                                                placeholder="Dog Name"
                                            />
                                        </div>

                                        <div className="owner-profile-form-field-col-2">
                                            <TextField
                                                // label="Breed"
                                                name="dogBreed"
                                                type="text"
                                                placeholder=" Dog Breed"
                                            />
                                        </div>

                                        {/* <div>
                            <TextField
                                // label="Dog Photo"
                                name="dogPhoto"
                                type="text"
                                placeholder="NOT WORKING - PLACEHOLDER Dog Photo"
                            />
                            </div> */}

                                        <div className="owner-profile-form-field-2-col-span">
                                            <h1 className="owner-profile-form-heading">
                                                Dog Size
                                            </h1>
                                            <div className="sign-up-form-radio-buttons">
                                                <label htmlFor="">
                                                    Small Dog:
                                                    <Field
                                                        id="smallDog"
                                                        type="radio"
                                                        name="dogSize"
                                                        value="S"
                                                    />
                                                </label>

                                                <label htmlFor="">
                                                    Medium Dog:
                                                    <Field
                                                        id="mediumDog"
                                                        type="radio"
                                                        name="dogSize"
                                                        value="M"
                                                    />
                                                </label>

                                                <label htmlFor="">
                                                    Large Dog:
                                                    <Field
                                                        id="largeDog"
                                                        type="radio"
                                                        name="dogSize"
                                                        value="L"
                                                    />
                                                </label>
                                            </div>
                                            <ErrorMessage
                                                name="dogSize"
                                                className="error"
                                                component="p"
                                            />
                                        </div>

                                        <div className="owner-profile-form-field-2-col-span">
                                            <h1 className="owner-profile-form-heading">
                                                Always Leashed?
                                            </h1>
                                            <div className="sign-up-form-radio-buttons">
                                                <label htmlFor="">
                                                    Yes:
                                                    <Field
                                                        id="requiresLeash"
                                                        type="radio"
                                                        name="requiresLeash"
                                                        value="YES"
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                    />
                                                </label>

                                                <label htmlFor="">
                                                    No:
                                                    <Field
                                                        id="doesNotRequireLeash"
                                                        type="radio"
                                                        name="requiresLeash"
                                                        value="NO"
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                    />
                                                </label>
                                            </div>
                                            {/* <Field
                                type="radio"
                                name="requiresLeash"
                                value="TRUE"
                                label="Leashed?"
                                onChange={formik.handleChange}
                                selected={
                                    formik.values.type === "TRUE" ? true : false
                                }
                            />
                            <label>Leashed?</label>

                            <Field
                                type="radio"
                                name="requiresLeash"
                                value="FALSE"
                                label="No Leash"
                                onChange={formik.handleChange}
                                selected={
                                    formik.values.type === "FALSE"
                                        ? true
                                        : false
                                }
                            />
                            <label>No Leashed</label> */}
                                        </div>

                                        <ErrorMessage
                                            name="requiresLeash"
                                            className="error"
                                            component="p"
                                        />

                                        <div className="owner-profile-form-field-2-col-span">
                                            <h1 className="owner-profile-form-heading">
                                                Accept Terms?
                                            </h1>
                                            <label
                                                htmlFor="acceptTerms"
                                                className="accept_terms"
                                            >
                                                <Field
                                                    id="acceptTerms"
                                                    type="checkbox"
                                                    name="acceptTerms"
                                                />
                                                Accept Terms and Conditions
                                            </label>

                                            <ErrorMessage
                                                name="acceptTerms"
                                                className="error"
                                                component="p"
                                            />
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="owner-profile-form-field-2-col-span">
                                <button
                                    id="submit"
                                    className="btn btn-dark mt-3"
                                    type="submit"
                                >
                                    Create Profile
                                </button>
                                <button
                                    id="reset"
                                    className="btn btn-danger mt-3 ms-3"
                                    type="reset"
                                >
                                    Reset
                                </button>
                            </div>
                        </Form>
                    </div>
                )}
            </Formik>
        </>
    );
}

export default OwnerProfileForm;
