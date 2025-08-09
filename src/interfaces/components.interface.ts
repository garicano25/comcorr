import React from "react";
import { PermisosType } from "../utils/types";

export interface SlideBarProps {
    isAsideVisible: boolean;
    toggleAside: () => void;
}


export interface CustomNavLinkProps {
    to: string; 
    imageSrc: string; 
    text: string; 
}


export interface LoaderProps {
    color?: "primary" | "secondary" | "success" | "warning" | "inherit" | "error" | "info" | undefined;
    size?: string;
    className?: string;
    textInfo?: string | null
}

export interface IAuthPermissionComponentProps {
  permissions: PermisosType | PermisosType[];
  children: React.ReactNode;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface Porcentaje {
  color: string;
  width: number;
  start: number;
}

export interface ProgressBarProps {
  porcentajes: Porcentaje[];
}