
export const Permisos = {
    user: {
        user: {
            add: 'user.can_add',
            view: 'user.can_view',
            update: 'user.can_update',
            delete: 'user.can_delete',
        }
    },
    rol: {
        rol: {
            add: 'rol.can_add',
            view: 'rol.can_view',
            update: 'rol.can_update',
            delete: 'rol.can_delete'
        }
    }
} as const;