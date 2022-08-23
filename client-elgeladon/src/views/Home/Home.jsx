import './Home.css';
import PaletaLista from 'components/PaletaLista/PaletaLista';
import AdicionaEditaPaletaModal from '../../components/AddPaletaModal/AdicionaEditaPaletaModal';
import SacolaModal from 'components/SacolaModal/SacolaModal';
import { SacolaService } from 'services/SacolaService';
import DeletaPaletaModal from 'components/DeletaPaletaModal/DeletaPaletaModal';
import Navbar from 'components/Navbar/Navbar';
import { ActionMode } from 'constants/index';
import { useState } from 'react';

function Home() {
  const [canOpenBag, setCanOpenBag] = useState();
  const [canShowAdicionaPaletaModal, setCanShowAdicionaPaletaModal] = useState(false);
  const [paletaParaAdicionar, setPaletaParaAdicionar] = useState();
  const [modoAtual, setModoAtual] = useState(ActionMode.NORMAL);
  const handleActions = (action) => {
    const novaAcao = modoAtual === action ? ActionMode.NORMAL : action;
    setModoAtual(novaAcao);
  };

  const abrirSacola = async () => {
    const lista = JSON.parse(localStorage.getItem('sacola'));
    const sacola = lista.filter((i) => i.quantidade > 0);
    await SacolaService.create(sacola);
    setCanOpenBag(true);
  };

  const [paletaParaEditar, setPaletaParaEditar] = useState();
  const [paletaParaDeletar, setPaletaParaDeletar] = useState();
  const [paletaRemovida, setPaletaRemovida] = useState();
  const [paletaEditada, setPaletaEditada] = useState();
  const handleDeletePaleta = (paletaToDelete) => {
    setPaletaParaDeletar(paletaToDelete);
  };

  const handleUpdatePaleta = (paletaToUpdate) => {
    setPaletaParaEditar(paletaToUpdate);
    setCanShowAdicionaPaletaModal(true);
  };

  const handleCloseModal = () => {
    setCanShowAdicionaPaletaModal(false);
    setPaletaParaAdicionar();
    setPaletaParaDeletar();
    setPaletaParaEditar();
    setModoAtual(ActionMode.NORMAL);
  };

  return (
    <div className='Home'>
      <Navbar
        mode={modoAtual}
        createPaleta={() => setCanShowAdicionaPaletaModal(true)}
        deletePaleta={() => handleActions(ActionMode.DELETAR)}
        openBag={abrirSacola}
        updatePaleta={() => handleActions(ActionMode.ATUALIZAR)}
      />
      <div className='Home__container'>
        <PaletaLista
          mode={modoAtual}
          paletaCriada={paletaParaAdicionar}
          deletePaleta={handleDeletePaleta}
          paletaRemovida={paletaRemovida}
          updatePaleta={handleUpdatePaleta}
          paletaEditada={paletaEditada}
        />
        {canShowAdicionaPaletaModal && (
          <AdicionaEditaPaletaModal
            mode={modoAtual}
            paletaToUpdate={paletaParaEditar}
            onUpdatePaleta={(paleta) => setPaletaEditada(paleta)}
            closeModal={handleCloseModal}
            onCreatePaleta={(paleta) => setPaletaParaAdicionar(paleta)}
          />
        )}
        {paletaParaDeletar && (
          <DeletaPaletaModal
            paletaParaDeletar={paletaParaDeletar}
            closeModal={handleCloseModal}
            onDeletePaleta={(paleta) => setPaletaRemovida(paleta)}
          />
        )}
        {canOpenBag && <SacolaModal closeModal={() => setCanOpenBag(false)} />}
      </div>
    </div>
  );
}

export default Home;
