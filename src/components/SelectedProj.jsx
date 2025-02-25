import React, { useEffect, useRef, useState } from 'react';
import './style/SelectedProj.css';
import Popup from './popup';
import ProjectScreen from './projectScreen';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Background from './background';

gsap.registerPlugin(ScrollTrigger);

function SelectedProj() {
  const [isScreenVisible, setScreenVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isMouseDevice, setIsMouseDevice] = useState(true);

  const projectScreenRef = useRef(null);
  const popupRef = useRef(null);
  const projectContRef = useRef(null);
  const imgRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const projectRefs = useRef([]);
  const mousePos = useRef({ x: 900, y: 500 });
  const speed = 0.1;

  useEffect(() => {
    // Detect if the device supports hover (mouse vs. touch)
    const checkDeviceType = () => {
      setIsMouseDevice(window.matchMedia('(hover: hover)').matches);
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);

    if (isMouseDevice) {
      const projectCont = projectContRef.current;
      const popup = popupRef.current;

      const showPopup = () => {
        popup.style.display = 'flex';
        setTimeout(() => {
          popup.style.transform = 'scale(1)';
        }, 300);
      };

      const hidePopup = () => {
        popup.style.transform = 'scale(0)';
        setTimeout(() => {
          popup.style.display = 'none';
        }, 300);
      };

      const updateMousePosition = (e) => {
        mousePos.current.x = e.clientX;
        mousePos.current.y = e.clientY;
      };

      const animatePopup = () => {
        const targetX = mousePos.current.x - popup.offsetWidth / 2;
        const targetY = mousePos.current.y - popup.offsetHeight / 2;

        const currentX = parseFloat(popup.style.left) || 0;
        const currentY = parseFloat(popup.style.top) || 0;

        popup.style.left = `${currentX + (targetX - currentX) * speed}px`;
        popup.style.top = `${currentY + (targetY - currentY) * speed}px`;

        requestAnimationFrame(animatePopup);
      };

      animatePopup();

      projectCont.addEventListener('mousemove', updateMousePosition);

      const handleMouseEnter = (index) => {
        imgRefs.forEach((imgRef, idx) => {
          imgRef.current.style.transform = `translateY(${(idx - index) * 100}%)`;
        });
      };

      projectRefs.current.forEach((project, index) => {
        if (project) {
          project.addEventListener('mouseenter', () => handleMouseEnter(index));
        }
      });

      projectCont.addEventListener('mouseenter', showPopup);
      projectCont.addEventListener('mouseleave', hidePopup);

      // GSAP Timeline for reveal and reverse animations
      projectRefs.current.forEach((project) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: project,
            start: 'top 95%',
            end: 'top top',
            scrub: false,
            markers: false,
            onEnter: () => tl.play(),
            onLeave: () => tl.reverse(),
            onEnterBack: () => tl.play(),
            onLeaveBack: () => tl.reverse(),
          },
        });

        tl.fromTo(
          project,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: 'power3.out',
          }
        );
      });

      return () => {
        projectCont.removeEventListener('mousemove', updateMousePosition);
        projectCont.removeEventListener('mouseenter', showPopup);
        projectCont.removeEventListener('mouseleave', hidePopup);
        projectRefs.current.forEach((project, index) => {
          if (project) {
            project.removeEventListener('mouseenter', () => handleMouseEnter(index));
          }
        });
      };
    }
  }, [isMouseDevice]);

  const showProjectScreen = (title, event) => {
    setSelectedProject(title);
    setScreenVisible(true);

    const clickX = event.clientX;
    const clickY = event.clientY;

    gsap.fromTo(projectScreenRef.current,
      { clipPath: `circle(0% at ${clickX}px ${clickY}px)` },
      { clipPath: 'circle(150% at 50% 50%)', duration: 3, ease: 'power3.out' }
    );
  };

  const hideProjectScreen = () => {
    gsap.to(projectScreenRef.current,
      { clipPath: 'circle(0% at 50% 50%)', duration: 0.5, ease: 'power3.out', onComplete: () => setScreenVisible(false) }
    );
  };

  return (
    <div className='project-bg' id='projects'>
      {isScreenVisible && (
        <ProjectScreen ref={projectScreenRef} selectedProject={selectedProject} onClose={hideProjectScreen} />
      )}

      <Popup ref={popupRef} imgRefs={imgRefs} />

      <h2>Selected Projects</h2>

      {isMouseDevice ? (
        // 🖱 Mouse-based layout (Hover effects enabled)
        <div className='project-cont' ref={projectContRef}>
          {['Maze Escape', 'Machine Learning', 'Online Store App', 'Portfolio'].map((title, index) => (
            <div className='proj69' ref={(el) => (projectRefs.current[index] = el)} key={index}>
              <div className='project' onClick={(e) => showProjectScreen(title, e)}>
                <div className='project-name'>
                  <p className='nump'>{`0${index + 1}`}</p>
                  <h1>{title}</h1>
                </div>
                <div className='categories'>
                  <p className='descp'>{getCategory(title)}</p>
                </div>
              </div>
              <hr className='line' />
            </div>
          ))}
        </div>
      ) : (
        // 📱 Touch-based layout (No hover effects)
        <div className=''>
          <div className='grid grid-cols-2 grid-flow-row max-sm:grid-cols-1 gap-6 gap-y-32 px-4' ref={projectContRef}>
            {['Maze Escape', 'Machine Learning', 'Online Store App', 'Portfolio'].map((title, index) => (
              <div className='w-80 max-sm:w-[80vw] flex flex-col gap-y-4 items-center' key={index}>
                <div className="w-80 aspect-[77/44] max-sm:w-[80vw] bg-cover bg-center rounded-xl" style={{ backgroundImage: `url(${getImage(title)})` }}></div>
                <h1 className='khula-regular text-4xl mt-8'>{title}</h1>
                  <p className='descp'>{getCategory(title)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to determine category based on project title
function getCategory(title) {
  switch (title) {
    case 'Maze Escape':
      return 'Python Development';
    case 'Machine Learning':
      return 'Python Development / Data Science';
    case 'Online Store App':
      return 'Python Development / Design';
    case 'Portfolio':
      return 'Frontend Development';
    default:
      return '';
  }
}
function getImage(title) {
  switch (title) {
    case 'Maze Escape':
      return './assets/game.png';
    case 'Machine Learning':
      return './assets/ML.png';
    case 'Online Store App':
      return './assets/store.png';
    case 'Portfolio':
      return './assets/port.pn';
    default:
      return '';
  }
}

export default SelectedProj;
