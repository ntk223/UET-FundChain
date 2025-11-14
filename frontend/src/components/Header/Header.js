import WalletConnection from "./WalletConnection.js";
import { Globe } from "lucide-react";
const Header = () => {
    return (
    <>
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Campaign DApp</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <WalletConnection />
            </div>
          </div>
        </div>
      </header>
    </>
    )
}

export default Header;