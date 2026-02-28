'use client';

import { useEffect, useState } from 'react';
import Joyride, { STATUS, Step } from 'react-joyride';

export default function GuidedTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Verificamos si es la primera vez del usuario en la tienda
    const hasSeenTour = localStorage.getItem('agrotienda_tour_v1');
    if (!hasSeenTour) {
      // Damos 1.5 segundos para que la página cargue visualmente antes de saltar
      const timer = setTimeout(() => setRun(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    
    // Si el usuario termina o salta el tour, no lo volvemos a molestar
    if (finishedStatuses.includes(status)) {
      localStorage.setItem('agrotienda_tour_v1', 'true');
      setRun(false);
    }
  };

  const steps: Step[] = [
    {
      target: '#inicio',
      content: '¡Hola! Bienvenido a Agrotienda La Floresta. Te daremos un recorrido rápido para que aprendas a hacer tu mercado.',
      disableBeacon: true,
      placement: 'center',
    },
    {
      target: '#productos',
      content: 'Aquí encontrarás la cosecha fresca. Escoge tus productos, la cantidad y agrégalos a tu canasto.',
      placement: 'top',
    },
    {
      target: '#btn-carrito',
      content: 'Cuando termines, toca esta canasta para ver tu pedido total y enviárnoslo por WhatsApp.',
      placement: 'bottom-end',
    },
    {
      target: '#btn-whatsapp',
      content: '¿Tienes dudas? Toca aquí en cualquier momento y te ayudaremos personalmente.',
      placement: 'left-end',
    }
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showSkipButton={true}
      showProgress={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#16a34a', // Verde Tailwind (green-600)
          zIndex: 10000,
          backgroundColor: '#ffffff',
          textColor: '#1e293b',
        },
        tooltipContainer: {
          textAlign: 'left'
        },
        buttonNext: {
          fontWeight: 'bold',
          borderRadius: '8px',
        },
        buttonBack: {
          marginRight: 10
        }
      }}
      locale={{
        back: 'Atrás',
        close: 'Cerrar',
        last: '¡Empezar a comprar!',
        next: 'Siguiente',
        skip: 'Saltar tutorial'
      }}
    />
  );
}