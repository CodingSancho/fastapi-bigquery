import useSWR from "swr";
const fetcher = (...args) => fetch(...args).then((res) => res.json());
const UserDetails = () => {
  const { data, error, isLoading } = useSWR(
    "http://localhost:8000/user_details/",
    fetcher
  );

  if (error) return <div>Failed to load user details</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h3>User Details</h3>
      <ul>
        {data.data.map((user) => (
          <li key={user.email}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDetails;
