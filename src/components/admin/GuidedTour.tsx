'use client';

import { useEffect, useState } from 'react';
import Joyride, { STATUS, Step } from 'react-joyride';

export default function GuidedTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('agrotienda_tour_v2'); // Nueva versión del tour
    if (!hasSeenTour) {
      const timer = setTimeout(() => setRun(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
      localStorage.setItem('agrotienda_tour_v2', 'true');
      setRun(false);
    }
  };

  const steps: Step[] = [
    {
      target: '#inicio',
      content: '¡Bienvenido! Te enseñaremos cómo comprar productos frescos del Tolima en menos de 1 minuto.',
      disableBeacon: true,
      placement: 'center',
    },
    {
      target: '.tour-variante',
      content: 'Primero, elige la presentación. Puedes comprar por Libras, Kilos o Canastas. ¡Incluso puedes elegir calidades (Primera o Segunda)!',
      placement: 'top',
    },
    {
      target: '.tour-cantidad',
      content: 'Ajusta la cantidad de unidades que necesites. El precio se actualizará automáticamente.',
      placement: 'top',
    },
    {
      target: '.tour-agregar',
      content: 'Cuando estés listo, toca aquí para guardar el producto en tu canasto.',
      placement: 'bottom',
    },
    {
      target: '#btn-carrito',
      content: 'Aquí verás el resumen de todo tu mercado. Cuando termines, dale a "Enviar Pedido" para enviarnos tu pedido real por WhatsApp.',
      placement: 'bottom-end',
    },
    {
      target: '#btn-whatsapp',
      content: '¿Dudas con los precios o el envío? Háblanos directamente aquí y te atenderemos de inmediato.',
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
          primaryColor: '#16a34a',
          zIndex: 10000,
          backgroundColor: '#ffffff',
          textColor: '#1e293b',
        },
        buttonNext: {
          fontWeight: 'bold',
          borderRadius: '12px',
          padding: '10px 20px'
        },
        buttonBack: {
          marginRight: 10,
          color: '#64748b'
        }
      }}
      locale={{
        back: 'Atrás',
        close: 'Entendido',
        last: '¡Listo para comprar!',
        next: 'Siguiente',
        skip: 'Saltar tutorial'
      }}
    />
  );
}