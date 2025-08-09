import React from "react";
import { NavLink } from "react-router";
import { CustomNavLinkProps } from "../../interfaces/components.interface";

export const CustomNavLink: React.FC<CustomNavLinkProps> = ({ to, imageSrc, text }) => {
    return (
        <NavLink
            to={to}
            style={({ isActive }) => ({
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            padding: '0.25rem',
            cursor: 'pointer',
            borderRadius: '0.5rem',
            marginTop: '0.25rem',
            backgroundColor: isActive ? '#1e3a8a' : '',
            color: isActive ? 'white' : '',
            ':hover': {
                backgroundColor: '#1e3a8a',
                color: 'white'
            }
            })}
            end
        >
            {({ isActive }) => (
            <>
                <img
                src={imageSrc}
                alt={text}
                className={`nav-link-image ${isActive ? 'active' : ''}`}
                style={{
                    height: 'auto',
                    filter: isActive ? 'invert(1)' : ''
                }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{text}</span>
            </>
            )}
        </NavLink>

    );
};
