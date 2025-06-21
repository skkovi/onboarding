export default function AboutMe({ data, onUpdate, onNext, onPrevious }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const handleChange = (e) => {
    let field = e.target.name;
    let value = e.target.value;
    onUpdate({ [field]: value });
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-md text-gray-700 mb-2">
          About Me
        </label>
        <textarea
          name="aboutMe"
          value={data.aboutMe}
          onChange={handleChange}
          rows="4"
          className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
        >
          Submit
        </button>
      </form>
      <button onClick={onPrevious}>Go Back</button>
    </div>
  );
}
