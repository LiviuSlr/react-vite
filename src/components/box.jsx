export default function Box(){
    return(
        <article className="p-10 rounded-2xl bg-[url('/clinica.jpg')] bg-cover bg-center relative overflow-hidden h-50">
            <div className="absolute inset-0 bg-gray-100/80 text-black flex flex-col justify-center items-center p-6 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <h2 className="text-xl font-bold">Liviu Lodarul</h2>
                <p>Tehnician dentar</p>
            </div>
        </article>


    );
}