import DotsIcon from '@/assets/icons/dots-vertical.svg';
import PlusIcon from '@/assets/icons/plus-circle.svg';
import RefreshIcon from '@/assets/icons/refresh.svg';
import StarFillIcon from '@/assets/icons/star-fill.svg';
import StarIcon from '@/assets/icons/star.svg';

function Home() {
  const nbSettings = 5;

  const settings = [];
  for (let i = 0; i < nbSettings; i++) {
    settings.push(
      <div className='setting-item blur' key={i}>
        <button className='setting-item__favorite'>
          {i==0 ? (<StarFillIcon />) : (<StarIcon />)}
        </button>
        <button className='setting-item__actions'>
          <DotsIcon />
        </button>
        <div className='setting-item__logo'></div>
        <h3 className='setting-item__title'>Ma config</h3>
      </div>
    );
  }

  return (
    <div className='wrapper'>
      <h1 className='heading-4'>Manage your settings</h1>
      <section id="saved-settings">
        <div className='buttons-wrapper -to-right'>
          <button className='button -square -rounded blur'>
            <RefreshIcon />
          </button>
        </div>
        <h2 className='heading-6'>Saved settings</h2>
        <div className='grid'>
          {settings}
          <button className='button setting-item setting-item--add blur'>
            <PlusIcon />
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home
