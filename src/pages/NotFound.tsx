import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotFound = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-top pt-12 bg-spotify-dark text-white px-4">
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-9xl font-bold text-green-500">404</h1>
          <h2 className="text-4xl font-semibold mt-4 mb-6">Página Não Encontrada</h2>
          <p className="text-lg text-gray-400 mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
          <Link 
            to="/" 
            className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-3 rounded-xl transition inline-block"
          >
            Voltar para Página Inicial
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
