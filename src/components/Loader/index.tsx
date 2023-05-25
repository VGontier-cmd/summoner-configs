import './loader.scss'

const Loader = () => {
    const numCubes = 5;

    const cubes = [];
    for (let i = 0; i < numCubes; i++) {
      cubes.push(<div className="cube" key={i}></div>);
    }
  
    return (
      <div className='flex-center'>
        <div className="loader">{cubes}</div>
      </div>
    )
};

export default Loader;