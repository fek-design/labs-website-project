/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';

export default function App() {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boxRef.current) {
      gsap.to(boxRef.current, {
        rotation: 360,
        x: 50,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-8 text-neutral-900 font-sans">
      <h1 className="text-4xl font-bold mb-12 tracking-tight text-neutral-900">Welcome</h1>
    </div>
  );
}
