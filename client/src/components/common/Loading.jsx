const Loading = () => {
  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <img src="/loading.svg" alt="" />
      </div>
      <p className="fixed inset-0 z-40 opacity-50 bg-black"></p>
    </>
  );
};

export default Loading;
