
export function Navbar({user}) {
   
    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-4">
            PayTM App
        </div>
        <div className="flex">
            <div className="rounded-lg h-8 w-24  bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    H! {user}
                </div>
            </div>
        </div>
    </div>
}