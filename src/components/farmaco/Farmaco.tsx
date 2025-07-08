import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FirebaseService from '@/services/FirebaseService';
import { Farmaco } from '@/models/farmaco.model';
import { useAuth } from '../contexts/AuthContext';
import './Farmaco.css';

function FarmacoPage() {
  const { isMedic } = useAuth();
  const { slug } = useParams();
  const navigate = useNavigate();

  const [farmaco, setFarmaco] = useState<Farmaco | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!slug) {
      navigate('/');
      return;
    }
    const idFarmaco = slug.split('-')[0];

    FirebaseService.getFarmaci().then((response: any[]) => {
      const f = response.find((f: any) => f.id === idFarmaco) || null;
      setFarmaco(f);
    });
  }, [slug, navigate]);

  useEffect(() => {
    handleValidation();
  }, [farmaco]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (field: keyof Farmaco, value: any) => {
    if (!farmaco) return;
    setFarmaco({
      ...farmaco,
      [field]: value,
    });
  };

  const handleValidation = () => {
    if (!farmaco) {
      setIsValid(false);
      return;
    }
    if (
      farmaco.nome.trim() === '' ||
      farmaco.descrizione.trim() === '' ||
      farmaco.avvertenze.trim() === '' ||
      !farmaco.barcode
    ) {
      setIsValid(false);
      return;
    }
    setIsValid(true);
  };

  return (
    <div className="farmaco-container">
      {farmaco === null ? (
        <div>
          <h2 className="error-title">Errore!</h2>
          <p className="error-text">Farmaco non trovato. Riprova più tardi.</p>
        </div>
      ) : (
        <>
          <div className="header">
            <h2>Gestione Farmaco</h2>
            {isMedic && (
              <button
                className="btn-edit"
                onClick={toggleEdit}
              >
                {isEditing ? 'Annulla' : 'Modifica'}
              </button>
            )}
          </div>

          <div className="form-fields">
            <div>
              <label>Nome</label>
              <input
                type="text"
                value={farmaco.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label>Descrizione</label>
              <textarea
                value={farmaco.descrizione}
                onChange={(e) => handleChange('descrizione', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label>Avvertenze</label>
              <textarea
                value={farmaco.avvertenze}
                onChange={(e) => handleChange('avvertenze', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label>Barcode</label>
              <input
                type="number"
                value={farmaco.barcode}
                onChange={(e) => handleChange('barcode', Number(e.target.value))}
                disabled={!isEditing}
              />
            </div>
          </div>

          {isEditing && isMedic && (
            <div className="action-buttons">
              {isValid ? (
                <button
                  className="btn-save"
                  onClick={() => {
                    FirebaseService.updateFarmaco(farmaco).then(() => {
                      toggleEdit();
                    });
                  }}
                >
                  Salva modifiche
                </button>
              ) : (
                <button
                  className="btn-disabled"
                  disabled
                >
                  Salva modifiche
                </button>
              )}

              <button
                className="btn-delete"
                onClick={() => {
                  FirebaseService.deleteFarmaco(farmaco.id).then(() => {
                    navigate('/farmaci');
                  });
                }}
              >
                Elimina Farmaco
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FarmacoPage;
