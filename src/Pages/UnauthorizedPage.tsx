
export function UnauthorizedPage() {
  return (
    <div className='flex flex-col justify-center items-center p-5 h-screen w-full bg-slate-300'>
      <p className='font-bold text-3xl text-center text-red-600'>No tienes permisos para navegar en esta sección</p>
      <p className='mt-5 text-center font-semibold'>Si crees que es un error, comunícate con el responsable.</p>
    </div>
  )
}
