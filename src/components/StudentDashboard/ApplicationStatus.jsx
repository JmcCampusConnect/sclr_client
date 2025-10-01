import React from "react";
import { Card, StatusMessage } from "./UI";

const ApplicationStatus = ({ status }) => (
    <Card title="Application Status">
        {status === 0 && <StatusMessage type="pending" message="Your application is under process." />}
        {status === 1 && <StatusMessage type="approved" message="Your application is selected. If any query, contact ERP or the Scholarship Office." />}
        {status === 2 && <StatusMessage type="rejected" message="Your application has been rejected." />}
    </Card>
)

export default ApplicationStatus;