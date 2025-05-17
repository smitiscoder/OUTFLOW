import React from 'react';
import { GithubIcon, TwitterIcon, InstagramIcon } from 'lucide-react';
import { Separator } from '../../components/ui/separator';

const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-outflow-black border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-outflow-accent flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <h3 className="text-white font-bold text-xl">OUTFLOW</h3>
            </div>
            <p className="text-white/60 text-sm mt-3 max-w-md">
              The intelligent expense tracking application that helps you take control of your financial future.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 md:gap-24">
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-white/70 hover:text-outflow-accent transition-colors" aria-label="Twitter">
                  <TwitterIcon size={18} />
                </a>
                <a href="#" className="text-white/70 hover:text-outflow-accent transition-colors" aria-label="Instagram">
                  <InstagramIcon size={18} />
                </a>
                <a href="#" className="text-white/70 hover:text-outflow-accent transition-colors" aria-label="GitHub">
                  <GithubIcon size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Privacy</a></li>
                <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">© 2025 OUTFLOW. All rights reserved.</p>
          <p className="text-white/60 text-sm italic mt-2 md:mt-0">Track smarter. Live better.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
