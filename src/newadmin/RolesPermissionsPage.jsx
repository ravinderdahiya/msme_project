import React from "react";
import { UserCog } from "lucide-react";
import { permissions, roles } from "./newAdminData";
import { Card } from "./AdminUI";

export default function RolesPermissionsPage() {
    return (
        <div className="new-admin-grid compact-sidebar">
            <Card title="Roles">
                <div className="role-list">
                    {roles.map((role) => (
                        <div key={role.role} className="role-row">
                            <div>
                                <strong>{role.role}</strong>
                                <span>{role.users} Users</span>
                            </div>
                            <UserCog size={16} />
                        </div>
                    ))}
                </div>
            </Card>
            <Card title="Permissions - Admin">
                <div className="permissions-list">
                    {permissions.map((group) => (
                        <div key={group.heading} className="permission-group">
                            <strong>{group.heading}</strong>
                            {group.items.map((item) => (
                                <label key={item} className="permission-check">
                                    <input type="checkbox" defaultChecked />
                                    <span>{item}</span>
                                </label>
                            ))}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
