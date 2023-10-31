export default function ErrorPage() {
  return (
    <div className="h-screen w-screen flex justify-center items-center flex-col">
      <h1 className="text-2xl font-bold text-red-400">Opps 404!</h1>
      <p>Page not found.please check your route path</p>
    </div>
  );
}
