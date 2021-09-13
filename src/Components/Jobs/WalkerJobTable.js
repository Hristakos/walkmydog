import React, { useState, useEffect } from "react";
import routes from "../../routes/routes";
import { NavLink } from "react-router-dom";
import { convertDateTime } from "../../Helpers/convertDateTime";

function ListingsTable({ data }) {
    const [finalisedData, setFinalisedData] = useState([]);

    useEffect(() => {
        setFinalisedData(convertDateTime(data));
    }, [data]);
    const { LISTINGS_DETAIL } = routes;
    return (
        <table className="tbl tbl--block">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Start Time</th>
                    {/* <th>Suburb</th> */}
                    <th>Status</th>
                    <th>Service</th>
                    <th>Dog Name</th>
                    <th>Service Fee</th>
                </tr>
            </thead>
            <tbody className="listings-table-data">
                {finalisedData.map((booking, idx) => (
                    <tr key={idx}>
                        <td>
                            <NavLink
                                to={`${LISTINGS_DETAIL}${booking.booking_id}`}
                            >
                                {booking.date}
                            </NavLink>
                        </td>
                        <td>
                            <NavLink
                                to={`${LISTINGS_DETAIL}${booking.booking_id}`}
                            >
                                {booking.start_time}
                            </NavLink>
                        </td>
                        {/* <td>
                            <NavLink
                                to={`${LISTINGS_DETAIL}${booking.booking_id}`}
                            >
                                {booking.suburb}
                            </NavLink>
                        </td> */}
                        <td>
                            <NavLink
                                to={`${LISTINGS_DETAIL}${booking.booking_id}`}
                            >
                                {booking.booking_status}
                            </NavLink>
                        </td>
                        <td>
                            <NavLink
                                to={`${LISTINGS_DETAIL}${booking.booking_id}`}
                            >
                                {booking.service_type}
                            </NavLink>
                        </td>
                        <td>
                            <NavLink
                                to={`${LISTINGS_DETAIL}${booking.booking_id}`}
                            >
                                {booking.dog_firstname}
                            </NavLink>
                        </td>
                        <td>
                            <NavLink
                                to={`${LISTINGS_DETAIL}${booking.booking_id}`}
                            >
                                ${booking.service_fee}
                            </NavLink>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default ListingsTable;
