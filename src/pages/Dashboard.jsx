function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="flex">
      <div className="w-1/5 bg-gray-800 text-white h-screen">
        <h2>MSME Portal</h2>
        <p>{user.role.toUpperCase()}</p>
      </div>

      <div className="w-4/5 p-5">
        <h1>Welcome {user.name}</h1>
      </div>
    </div>
  );
}
export default Dashboard; 