export interface Medicamento {
  id: number
  generico: string
  comerciales: string[]
  forma: string
  presentacion: string
  categoria: string
  laboratorio?: string
}

export const VADEMECUM: Medicamento[] = [
  // Antibióticos
  { id: 1, generico: 'Amoxicilina', comerciales: ['Amoxidal', 'Amoxi', 'Clamoxyl'], forma: 'Cápsulas / Suspensión', presentacion: '250mg, 500mg, 750mg, 1g', categoria: 'Antibiótico' },
  { id: 2, generico: 'Amoxicilina + Ácido clavulánico', comerciales: ['Augmentin', 'Amoxiclav', 'Bactox'], forma: 'Comprimidos / Suspensión', presentacion: '500mg+125mg, 875mg+125mg', categoria: 'Antibiótico' },
  { id: 3, generico: 'Azitromicina', comerciales: ['Zitromax', 'Azitral', 'Macrozit'], forma: 'Comprimidos / Suspensión', presentacion: '250mg, 500mg', categoria: 'Antibiótico' },
  { id: 4, generico: 'Ciprofloxacina', comerciales: ['Ciproflox', 'Cipro', 'Bactiflox'], forma: 'Comprimidos', presentacion: '250mg, 500mg, 750mg', categoria: 'Antibiótico' },
  { id: 5, generico: 'Cefalexina', comerciales: ['Keflex', 'Cefalexin', 'Alquil'], forma: 'Cápsulas / Suspensión', presentacion: '500mg, 1g', categoria: 'Antibiótico' },
  { id: 6, generico: 'Metronidazol', comerciales: ['Flagyl', 'Metroval', 'Metro'], forma: 'Comprimidos / Óvulos', presentacion: '250mg, 500mg', categoria: 'Antibiótico / Antiparasitario' },
  { id: 7, generico: 'Clindamicina', comerciales: ['Dalacin', 'Clindamycin'], forma: 'Cápsulas', presentacion: '150mg, 300mg', categoria: 'Antibiótico' },
  { id: 8, generico: 'Doxiciclina', comerciales: ['Vibramicina', 'Doxylets'], forma: 'Cápsulas', presentacion: '100mg', categoria: 'Antibiótico' },
  { id: 9, generico: 'Trimetoprima + Sulfametoxazol', comerciales: ['Bactrim', 'Septrin', 'Bactrexol'], forma: 'Comprimidos / Suspensión', presentacion: '80mg+400mg, 160mg+800mg', categoria: 'Antibiótico' },
  { id: 10, generico: 'Levofloxacina', comerciales: ['Levaquin', 'Tavanic', 'Levofox'], forma: 'Comprimidos', presentacion: '250mg, 500mg, 750mg', categoria: 'Antibiótico' },

  // Analgésicos / Antipiréticos
  { id: 11, generico: 'Paracetamol', comerciales: ['Tafirol', 'Tempra', 'Panadol', 'Termofren'], forma: 'Comprimidos / Jarabe / Supositorios', presentacion: '500mg, 1g', categoria: 'Analgésico / Antipirético' },
  { id: 12, generico: 'Ibuprofeno', comerciales: ['Ibupirac', 'Actron', 'Buprex', 'Advil'], forma: 'Comprimidos / Jarabe', presentacion: '200mg, 400mg, 600mg', categoria: 'AINE / Analgésico' },
  { id: 13, generico: 'Diclofenac', comerciales: ['Voltaren', 'Cataflam', 'Dicloflex'], forma: 'Comprimidos / Gel / Ampollas', presentacion: '50mg, 75mg', categoria: 'AINE / Analgésico' },
  { id: 14, generico: 'Ketorolac', comerciales: ['Dolac', 'Toradol', 'Acular'], forma: 'Comprimidos / Ampollas', presentacion: '10mg, 30mg', categoria: 'AINE / Analgésico' },
  { id: 15, generico: 'Metamizol (Dipirona)', comerciales: ['Novalgina', 'Dipirona', 'Novalgin'], forma: 'Comprimidos / Gotas / Ampollas', presentacion: '500mg, 1g', categoria: 'Analgésico / Antipirético' },
  { id: 16, generico: 'Naproxeno', comerciales: ['Flanax', 'Naprosyn', 'Naproxen'], forma: 'Comprimidos', presentacion: '250mg, 500mg', categoria: 'AINE / Analgésico' },
  { id: 17, generico: 'Celecoxib', comerciales: ['Celebrex', 'Celecox'], forma: 'Cápsulas', presentacion: '100mg, 200mg', categoria: 'AINE (Cox-2)' },

  // Cardiovascular — Antihipertensivos
  { id: 18, generico: 'Enalapril', comerciales: ['Lotrial', 'Glioten', 'Renitec', 'Enalapril Cinfamed'], forma: 'Comprimidos', presentacion: '5mg, 10mg, 20mg', categoria: 'IECA / Antihipertensivo' },
  { id: 19, generico: 'Losartán', comerciales: ['Cozaar', 'Losacor', 'Hyzaar'], forma: 'Comprimidos', presentacion: '25mg, 50mg, 100mg', categoria: 'ARAII / Antihipertensivo' },
  { id: 20, generico: 'Amlodipina', comerciales: ['Norvasc', 'Amlodipino', 'Amlibon'], forma: 'Comprimidos', presentacion: '5mg, 10mg', categoria: 'Bloqueante cálcico / Antihipertensivo' },
  { id: 21, generico: 'Atenolol', comerciales: ['Tenormin', 'Betacar', 'Blokium'], forma: 'Comprimidos', presentacion: '50mg, 100mg', categoria: 'Betabloqueante' },
  { id: 22, generico: 'Metoprolol', comerciales: ['Lopressor', 'Beloken', 'Seloken'], forma: 'Comprimidos', presentacion: '50mg, 100mg', categoria: 'Betabloqueante' },
  { id: 23, generico: 'Bisoprolol', comerciales: ['Concor', 'Bisomerck', 'Cardicor'], forma: 'Comprimidos', presentacion: '2.5mg, 5mg, 10mg', categoria: 'Betabloqueante' },
  { id: 24, generico: 'Carvedilol', comerciales: ['Coreg', 'Dilatrend', 'Carvedigamma'], forma: 'Comprimidos', presentacion: '3.125mg, 6.25mg, 12.5mg, 25mg', categoria: 'Betabloqueante / Antihipertensivo' },
  { id: 25, generico: 'Valsartán', comerciales: ['Diovan', 'Vals', 'Valsacor'], forma: 'Comprimidos', presentacion: '80mg, 160mg, 320mg', categoria: 'ARAII / Antihipertensivo' },
  { id: 26, generico: 'Ramipril', comerciales: ['Altace', 'Triatec', 'Ramipril Genfar'], forma: 'Comprimidos', presentacion: '2.5mg, 5mg, 10mg', categoria: 'IECA / Antihipertensivo' },
  { id: 27, generico: 'Perindopril', comerciales: ['Coversyl', 'Prestalia'], forma: 'Comprimidos', presentacion: '4mg, 8mg', categoria: 'IECA / Antihipertensivo' },

  // Diuréticos
  { id: 28, generico: 'Furosemida', comerciales: ['Lasix', 'Furosemida'], forma: 'Comprimidos / Ampollas', presentacion: '20mg, 40mg, 80mg', categoria: 'Diurético de asa' },
  { id: 29, generico: 'Hidroclorotiazida', comerciales: ['Diclozianer', 'HCT', 'Esidrex'], forma: 'Comprimidos', presentacion: '25mg, 50mg', categoria: 'Diurético tiazídico' },
  { id: 30, generico: 'Espironolactona', comerciales: ['Aldactone', 'Esinosyn', 'Verospiron'], forma: 'Comprimidos', presentacion: '25mg, 100mg', categoria: 'Diurético ahorrador de K+' },

  // Antiagregantes / Anticoagulantes
  { id: 31, generico: 'Aspirina (Ácido acetilsalicílico)', comerciales: ['Aspirin', 'Cardioaspirina', 'Adiro'], forma: 'Comprimidos', presentacion: '100mg, 325mg, 500mg', categoria: 'Antiagregante / AINE' },
  { id: 32, generico: 'Clopidogrel', comerciales: ['Plavix', 'Clopidogrel Genfar', 'Troken'], forma: 'Comprimidos', presentacion: '75mg', categoria: 'Antiagregante plaquetario' },
  { id: 33, generico: 'Warfarina', comerciales: ['Coumadin', 'Warfarina Sodica'], forma: 'Comprimidos', presentacion: '2.5mg, 5mg', categoria: 'Anticoagulante oral' },
  { id: 34, generico: 'Rivaroxabán', comerciales: ['Xarelto'], forma: 'Comprimidos', presentacion: '10mg, 15mg, 20mg', categoria: 'Anticoagulante oral (NOAC)' },
  { id: 35, generico: 'Apixabán', comerciales: ['Eliquis'], forma: 'Comprimidos', presentacion: '2.5mg, 5mg', categoria: 'Anticoagulante oral (NOAC)' },
  { id: 36, generico: 'Dabigatrán', comerciales: ['Pradaxa'], forma: 'Cápsulas', presentacion: '75mg, 110mg, 150mg', categoria: 'Anticoagulante oral (NOAC)' },

  // Hipolipemiantes
  { id: 37, generico: 'Atorvastatina', comerciales: ['Lipitor', 'Atoris', 'Lipistad'], forma: 'Comprimidos', presentacion: '10mg, 20mg, 40mg, 80mg', categoria: 'Estatina / Hipolipemiante' },
  { id: 38, generico: 'Rosuvastatina', comerciales: ['Crestor', 'Rosuvacor', 'Rosuvas'], forma: 'Comprimidos', presentacion: '5mg, 10mg, 20mg, 40mg', categoria: 'Estatina / Hipolipemiante' },
  { id: 39, generico: 'Simvastatina', comerciales: ['Zocor', 'Simvas', 'Simvastatina'], forma: 'Comprimidos', presentacion: '10mg, 20mg, 40mg', categoria: 'Estatina / Hipolipemiante' },
  { id: 40, generico: 'Ezetimiba', comerciales: ['Zetia', 'Ezetrol', 'Ezetimiba'], forma: 'Comprimidos', presentacion: '10mg', categoria: 'Hipolipemiante' },

  // Diabetes
  { id: 41, generico: 'Metformina', comerciales: ['Glucophage', 'Glafornil', 'Dimefor'], forma: 'Comprimidos', presentacion: '500mg, 850mg, 1000mg', categoria: 'Antidiabético oral (biguanida)' },
  { id: 42, generico: 'Glibenclamida', comerciales: ['Daonil', 'Euglucon'], forma: 'Comprimidos', presentacion: '2.5mg, 5mg', categoria: 'Antidiabético oral (sulfonilurea)' },
  { id: 43, generico: 'Glimepirida', comerciales: ['Amaryl', 'Glimepiride', 'Glemaz'], forma: 'Comprimidos', presentacion: '1mg, 2mg, 4mg', categoria: 'Antidiabético oral (sulfonilurea)' },
  { id: 44, generico: 'Sitagliptina', comerciales: ['Januvia', 'Ristaben'], forma: 'Comprimidos', presentacion: '25mg, 50mg, 100mg', categoria: 'Antidiabético oral (iDPP-4)' },
  { id: 45, generico: 'Empagliflozina', comerciales: ['Jardiance'], forma: 'Comprimidos', presentacion: '10mg, 25mg', categoria: 'Antidiabético oral (iSGLT-2)' },
  { id: 46, generico: 'Insulina NPH', comerciales: ['Insulina NPH Lilly', 'Humulin N', 'Insulatard'], forma: 'Solución inyectable', presentacion: '100 UI/mL x 10mL', categoria: 'Insulina (acción intermedia)' },
  { id: 47, generico: 'Insulina Glargina', comerciales: ['Lantus', 'Basaglar', 'Toujeo'], forma: 'Solución inyectable', presentacion: '100 UI/mL', categoria: 'Insulina (acción prolongada)' },

  // Respiratorio
  { id: 48, generico: 'Salbutamol', comerciales: ['Ventolin', 'Salbutamol Pliva', 'Albuterol'], forma: 'Aerosol / Solución nebulizable', presentacion: '100mcg/dosis', categoria: 'Broncodilatador (β2-agonista)' },
  { id: 49, generico: 'Salmeterol + Fluticasona', comerciales: ['Seretide', 'Advair', 'Foxair'], forma: 'Aerosol / Polvo', presentacion: '25+250mcg, 50+500mcg', categoria: 'Broncodilatador + Corticoide inhalado' },
  { id: 50, generico: 'Budesonida', comerciales: ['Pulmicort', 'Rhinocort', 'Budeson'], forma: 'Aerosol / Suspensión nebulizable', presentacion: '200mcg, 400mcg', categoria: 'Corticoide inhalado' },
  { id: 51, generico: 'Tiotropio', comerciales: ['Spiriva'], forma: 'Polvo inhalable', presentacion: '18mcg', categoria: 'Broncodilatador anticolinérgico (LAMA)' },
  { id: 52, generico: 'Montelukast', comerciales: ['Singulair', 'Monteluk', 'Airon'], forma: 'Comprimidos / Granulado', presentacion: '4mg, 5mg, 10mg', categoria: 'Antileucotrieno' },

  // Antihistamínicos
  { id: 53, generico: 'Cetirizina', comerciales: ['Zyrtec', 'Cetrimerck', 'Alercet'], forma: 'Comprimidos / Jarabe', presentacion: '10mg', categoria: 'Antihistamínico (2ª generación)' },
  { id: 54, generico: 'Loratadina', comerciales: ['Clarityne', 'Lorax', 'Histaloran'], forma: 'Comprimidos / Jarabe', presentacion: '10mg', categoria: 'Antihistamínico (2ª generación)' },
  { id: 55, generico: 'Fexofenadina', comerciales: ['Allegra', 'Fexofenadin', 'Telfast'], forma: 'Comprimidos', presentacion: '60mg, 120mg, 180mg', categoria: 'Antihistamínico (2ª generación)' },

  // Gastroenterología
  { id: 56, generico: 'Omeprazol', comerciales: ['Losec', 'Omepral', 'Ulcozol'], forma: 'Cápsulas / Ampollas', presentacion: '20mg, 40mg', categoria: 'IBP / Antiácido' },
  { id: 57, generico: 'Pantoprazol', comerciales: ['Pantoc', 'Protonix', 'Zoltum'], forma: 'Comprimidos / Ampollas', presentacion: '20mg, 40mg', categoria: 'IBP / Antiácido' },
  { id: 58, generico: 'Ranitidina', comerciales: ['Zantac', 'Ranitidina', 'Ulcodin'], forma: 'Comprimidos / Ampollas', presentacion: '150mg, 300mg', categoria: 'Antihistamínico H2' },
  { id: 59, generico: 'Domperidona', comerciales: ['Motilium', 'Dompel', 'Peridon'], forma: 'Comprimidos / Jarabe', presentacion: '10mg', categoria: 'Procinético' },
  { id: 60, generico: 'Metoclopramida', comerciales: ['Plasil', 'Metaclopramida', 'Reglan'], forma: 'Comprimidos / Ampollas', presentacion: '10mg', categoria: 'Procinético / Antiemético' },
  { id: 61, generico: 'Loperamida', comerciales: ['Imodium', 'Lopedium'], forma: 'Cápsulas', presentacion: '2mg', categoria: 'Antidiarreico' },

  // Neurología / Psiquiatría
  { id: 62, generico: 'Alprazolam', comerciales: ['Tranquinal', 'Alplax', 'Xanax'], forma: 'Comprimidos', presentacion: '0.25mg, 0.5mg, 1mg', categoria: 'Benzodiacepina / Ansiolítico' },
  { id: 63, generico: 'Clonazepam', comerciales: ['Rivotril', 'Clonax', 'Clonagin'], forma: 'Comprimidos / Gotas', presentacion: '0.5mg, 2mg', categoria: 'Benzodiacepina / Antiepiléptico' },
  { id: 64, generico: 'Lorazepam', comerciales: ['Ativan', 'Lorax', 'Lorazepam'], forma: 'Comprimidos / Ampollas', presentacion: '1mg, 2mg', categoria: 'Benzodiacepina / Ansiolítico' },
  { id: 65, generico: 'Sertralina', comerciales: ['Zoloft', 'Altisben', 'Sertralina'], forma: 'Comprimidos', presentacion: '25mg, 50mg, 100mg', categoria: 'ISRS / Antidepresivo' },
  { id: 66, generico: 'Fluoxetina', comerciales: ['Prozac', 'Flucital', 'Fluoxetina'], forma: 'Cápsulas', presentacion: '20mg', categoria: 'ISRS / Antidepresivo' },
  { id: 67, generico: 'Escitalopram', comerciales: ['Lexapro', 'Cipralex', 'Esertia'], forma: 'Comprimidos', presentacion: '5mg, 10mg, 20mg', categoria: 'ISRS / Antidepresivo' },
  { id: 68, generico: 'Paroxetina', comerciales: ['Paxil', 'Seroxat', 'Aropax'], forma: 'Comprimidos', presentacion: '20mg, 40mg', categoria: 'ISRS / Antidepresivo' },
  { id: 69, generico: 'Venlafaxina', comerciales: ['Efexor', 'Venlalic', 'Venlafaxina'], forma: 'Cápsulas (liberación extendida)', presentacion: '37.5mg, 75mg, 150mg', categoria: 'IRSN / Antidepresivo' },
  { id: 70, generico: 'Amitriptilina', comerciales: ['Tryptanol', 'Anapsique', 'Elavil'], forma: 'Comprimidos', presentacion: '10mg, 25mg', categoria: 'Antidepresivo tricíclico' },
  { id: 71, generico: 'Carbamazepina', comerciales: ['Tegretol', 'Carbatrol', 'Carbamat'], forma: 'Comprimidos / Jarabe', presentacion: '200mg, 400mg', categoria: 'Antiepiléptico / Estabilizador del ánimo' },
  { id: 72, generico: 'Levetiracetam', comerciales: ['Keppra', 'Levetiracetam'], forma: 'Comprimidos / Solución', presentacion: '250mg, 500mg, 1000mg', categoria: 'Antiepiléptico' },
  { id: 73, generico: 'Quetiapina', comerciales: ['Seroquel', 'Quetiapina'], forma: 'Comprimidos', presentacion: '25mg, 100mg, 200mg, 300mg', categoria: 'Antipsicótico atípico' },

  // Tiroides
  { id: 74, generico: 'Levotiroxina', comerciales: ['Eutirox', 'Levothroid', 'Synthroid'], forma: 'Comprimidos', presentacion: '25mcg, 50mcg, 75mcg, 100mcg, 125mcg, 150mcg', categoria: 'Hormona tiroidea' },
  { id: 75, generico: 'Metimazol', comerciales: ['Tapazole', 'Danantizol'], forma: 'Comprimidos', presentacion: '5mg, 10mg', categoria: 'Antitirodeo' },

  // Corticoides
  { id: 76, generico: 'Prednisona', comerciales: ['Meticorten', 'Deltasone', 'Prednisona'], forma: 'Comprimidos', presentacion: '5mg, 20mg, 40mg', categoria: 'Corticoide sistémico' },
  { id: 77, generico: 'Dexametasona', comerciales: ['Decadron', 'Dexametasona', 'Fortecortin'], forma: 'Comprimidos / Ampollas', presentacion: '0.5mg, 4mg, 8mg', categoria: 'Corticoide sistémico' },
  { id: 78, generico: 'Metilprednisolona', comerciales: ['Solu-Medrol', 'Depo-Medrol', 'Urbason'], forma: 'Comprimidos / Ampollas', presentacion: '4mg, 16mg, 40mg, 80mg', categoria: 'Corticoide sistémico' },

  // Vitaminas / Suplementos
  { id: 79, generico: 'Vitamina D3 (Colecalciferol)', comerciales: ['Replenisher D', 'Vitamina D3 Roemmers', 'Vigantol'], forma: 'Gotas / Cápsulas', presentacion: '400 UI, 1000 UI, 2000 UI, 50000 UI', categoria: 'Vitamina' },
  { id: 80, generico: 'Hierro (Sulfato ferroso)', comerciales: ['Fer-In-Sol', 'Sulfato Ferroso', 'Tardyferon'], forma: 'Comprimidos / Jarabe', presentacion: '200mg, 325mg', categoria: 'Suplemento mineral' },
  { id: 81, generico: 'Ácido fólico', comerciales: ['Acfol', 'Folacin', 'Natele'], forma: 'Comprimidos', presentacion: '0.4mg, 1mg, 5mg', categoria: 'Vitamina B9' },
  { id: 82, generico: 'Calcio + Vitamina D', comerciales: ['Cálcica D', 'Os-Cal', 'Calcimax'], forma: 'Comprimidos', presentacion: '500mg+200UI, 1000mg+400UI', categoria: 'Suplemento' },
  { id: 83, generico: 'Vitamina B12 (Cianocobalamina)', comerciales: ['Bedoyecta', 'Neurobión', 'Cianocobalamina'], forma: 'Ampollas / Comprimidos', presentacion: '1000mcg', categoria: 'Vitamina B12' },

  // Gota / Reumatología
  { id: 84, generico: 'Alopurinol', comerciales: ['Zyloric', 'Alopurinol', 'Lopurin'], forma: 'Comprimidos', presentacion: '100mg, 300mg', categoria: 'Antigotoso (xantina-oxidasa)' },
  { id: 85, generico: 'Colchicina', comerciales: ['Colchicina', 'Colcrys'], forma: 'Comprimidos', presentacion: '0.5mg, 1mg', categoria: 'Antigotoso' },
  { id: 86, generico: 'Metotrexato', comerciales: ['Metotrexato', 'Rheumatrex'], forma: 'Comprimidos / Ampollas', presentacion: '2.5mg, 10mg', categoria: 'Inmunosupresor / DMARD' },
  { id: 87, generico: 'Hidroxicloroquina', comerciales: ['Plaquenil'], forma: 'Comprimidos', presentacion: '200mg', categoria: 'DMARD / Antipalúdico' },

  // Otros frecuentes
  { id: 88, generico: 'Tamsulosina', comerciales: ['Flomax', 'Tamsulosina', 'Urimax'], forma: 'Cápsulas (liberación prolongada)', presentacion: '0.4mg', categoria: 'Alfa-1 bloqueante / HPB' },
  { id: 89, generico: 'Finasterida', comerciales: ['Proscar', 'Propecia', 'Finasteride'], forma: 'Comprimidos', presentacion: '1mg, 5mg', categoria: 'Inhibidor 5α-reductasa / HPB' },
  { id: 90, generico: 'Sildenafil', comerciales: ['Viagra', 'Revatio', 'Silden'], forma: 'Comprimidos', presentacion: '25mg, 50mg, 100mg', categoria: 'IPDE-5 / Disfunción eréctil' },
  { id: 91, generico: 'Ondansetrón', comerciales: ['Zofran', 'Ondansetron', 'Vonau'], forma: 'Comprimidos / Ampollas', presentacion: '4mg, 8mg', categoria: 'Antiemético (antagonista 5-HT3)' },
  { id: 92, generico: 'Tramadol', comerciales: ['Tramal', 'Ultram', 'Tramadol'], forma: 'Cápsulas / Ampollas', presentacion: '50mg, 100mg', categoria: 'Analgésico opioide' },
  { id: 93, generico: 'Morfina', comerciales: ['Morfina', 'MS Contin'], forma: 'Ampollas / Comprimidos', presentacion: '10mg, 30mg', categoria: 'Analgésico opioide' },
  { id: 94, generico: 'Zolpidem', comerciales: ['Stilnox', 'Ambien', 'Zolpidem'], forma: 'Comprimidos', presentacion: '5mg, 10mg', categoria: 'Hipnótico (no benzodiacepínico)' },
  { id: 95, generico: 'Aciclovir', comerciales: ['Zovirax', 'Aciclovir', 'Acivir'], forma: 'Comprimidos / Crema', presentacion: '200mg, 400mg, 800mg', categoria: 'Antiviral (herpesvirus)' },
  { id: 96, generico: 'Valaciclovir', comerciales: ['Valtrex', 'Valaciclovir', 'Zelitrex'], forma: 'Comprimidos', presentacion: '500mg, 1g', categoria: 'Antiviral (herpesvirus)' },

  // Antihipertensivos adicionales
  { id: 97, generico: 'Olmesartán', comerciales: ['Olmetec', 'Benicar', 'Olsar'], forma: 'Comprimidos', presentacion: '20mg, 40mg', categoria: 'ARAII / Antihipertensivo' },
  { id: 98, generico: 'Irbesartán', comerciales: ['Aprovel', 'Avapro', 'Coaprovel'], forma: 'Comprimidos', presentacion: '75mg, 150mg, 300mg', categoria: 'ARAII / Antihipertensivo' },
  { id: 99, generico: 'Telmisartán', comerciales: ['Micardis', 'Pritor', 'Kinzal'], forma: 'Comprimidos', presentacion: '40mg, 80mg', categoria: 'ARAII / Antihipertensivo' },
  { id: 100, generico: 'Nebivolol', comerciales: ['Nebilet', 'Lobivon', 'Nebilox'], forma: 'Comprimidos', presentacion: '5mg', categoria: 'Betabloqueante' },
  { id: 101, generico: 'Nifedipina', comerciales: ['Adalat', 'Nifedipina Retard', 'Osar'], forma: 'Comprimidos (liberación prolongada)', presentacion: '10mg, 20mg, 30mg, 60mg', categoria: 'Bloqueante cálcico / Antihipertensivo' },
  { id: 102, generico: 'Diltiazem', comerciales: ['Tilazem', 'Cardizem', 'Dilzem'], forma: 'Comprimidos / Cápsulas LP', presentacion: '60mg, 90mg, 120mg, 180mg', categoria: 'Bloqueante cálcico / Antiarrítmico' },
  { id: 103, generico: 'Verapamilo', comerciales: ['Isoptin', 'Verapamilo', 'Calan'], forma: 'Comprimidos', presentacion: '80mg, 120mg, 240mg', categoria: 'Bloqueante cálcico / Antiarrítmico' },

  // Cardiovascular
  { id: 104, generico: 'Digoxina', comerciales: ['Lanoxin', 'Digoxina'], forma: 'Comprimidos / Ampollas', presentacion: '0.25mg', categoria: 'Glucósido cardíaco / Antiarrítmico' },
  { id: 105, generico: 'Amiodarona', comerciales: ['Cordarone', 'Atlansil', 'Amiodarona'], forma: 'Comprimidos / Ampollas', presentacion: '200mg, 150mg/3mL', categoria: 'Antiarrítmico' },
  { id: 106, generico: 'Ivabradina', comerciales: ['Procoralan', 'Corlentor'], forma: 'Comprimidos', presentacion: '5mg, 7.5mg', categoria: 'Antianginoso (If inhibidor)' },
  { id: 107, generico: 'Nitroglicerina', comerciales: ['Nitronal', 'Trinipatch', 'Nitroderm'], forma: 'Parche transdérmico / Aerosol sublingual', presentacion: '0.4mg/dosis, 5mg/24h, 10mg/24h', categoria: 'Nitrato / Antianginoso' },
  { id: 108, generico: 'Mononitrato de isosorbide', comerciales: ['Monocordil', 'Imdur', 'Ismo'], forma: 'Comprimidos', presentacion: '20mg, 40mg, 60mg', categoria: 'Nitrato / Antianginoso' },
  { id: 109, generico: 'Sacubitril + Valsartán', comerciales: ['Entresto'], forma: 'Comprimidos', presentacion: '24/26mg, 49/51mg, 97/103mg', categoria: 'ARNI / Insuficiencia cardíaca' },
  { id: 110, generico: 'Dapagliflozina', comerciales: ['Forxiga', 'Farxiga'], forma: 'Comprimidos', presentacion: '5mg, 10mg', categoria: 'Antidiabético oral (iSGLT-2) / IC' },

  // Diabetes y metabolismo
  { id: 111, generico: 'Liraglutida', comerciales: ['Victoza', 'Saxenda'], forma: 'Solución inyectable (pluma)', presentacion: '6mg/mL', categoria: 'Antidiabético (GLP-1)' },
  { id: 112, generico: 'Semaglutida', comerciales: ['Ozempic', 'Rybelsus', 'Wegovy'], forma: 'Inyectable / Comprimidos', presentacion: '0.5mg, 1mg, 2mg', categoria: 'Antidiabético (GLP-1)' },
  { id: 113, generico: 'Canagliflozina', comerciales: ['Invokana'], forma: 'Comprimidos', presentacion: '100mg, 300mg', categoria: 'Antidiabético oral (iSGLT-2)' },
  { id: 114, generico: 'Pioglitazona', comerciales: ['Actos', 'Pionix'], forma: 'Comprimidos', presentacion: '15mg, 30mg, 45mg', categoria: 'Antidiabético oral (tiazolidindiona)' },
  { id: 115, generico: 'Insulina Lispro', comerciales: ['Humalog', 'Liprolog'], forma: 'Solución inyectable', presentacion: '100 UI/mL', categoria: 'Insulina (acción rápida)' },
  { id: 116, generico: 'Insulina Aspártica', comerciales: ['Novorapid', 'Fiasp'], forma: 'Solución inyectable', presentacion: '100 UI/mL', categoria: 'Insulina (acción rápida)' },
  { id: 117, generico: 'Insulina Detemir', comerciales: ['Levemir'], forma: 'Solución inyectable', presentacion: '100 UI/mL', categoria: 'Insulina (acción prolongada)' },

  // Neurología / Psiquiatría (adicionales)
  { id: 118, generico: 'Pregabalina', comerciales: ['Lyrica', 'Pregabalin', 'Lyrica CR'], forma: 'Cápsulas', presentacion: '25mg, 75mg, 150mg, 300mg', categoria: 'Antiepiléptico / Dolor neuropático' },
  { id: 119, generico: 'Gabapentina', comerciales: ['Neurontin', 'Gabapentin', 'Gabalept'], forma: 'Cápsulas / Comprimidos', presentacion: '100mg, 300mg, 400mg, 600mg', categoria: 'Antiepiléptico / Dolor neuropático' },
  { id: 120, generico: 'Topiramato', comerciales: ['Topamax', 'Topamac', 'Epitomax'], forma: 'Comprimidos / Cápsulas', presentacion: '25mg, 50mg, 100mg, 200mg', categoria: 'Antiepiléptico / Migraña' },
  { id: 121, generico: 'Lamotrigina', comerciales: ['Lamictal', 'Lamotrin', 'Lambipol'], forma: 'Comprimidos', presentacion: '25mg, 50mg, 100mg, 200mg', categoria: 'Antiepiléptico / Estabilizador del ánimo' },
  { id: 122, generico: 'Ácido valproico', comerciales: ['Depakene', 'Epival', 'Valcote'], forma: 'Comprimidos / Jarabe / Ampollas', presentacion: '200mg, 250mg, 500mg', categoria: 'Antiepiléptico / Estabilizador del ánimo' },
  { id: 123, generico: 'Risperidona', comerciales: ['Risperdal', 'Risperidona', 'Belivon'], forma: 'Comprimidos / Solución / Inyectable', presentacion: '0.5mg, 1mg, 2mg, 3mg, 4mg', categoria: 'Antipsicótico atípico' },
  { id: 124, generico: 'Olanzapina', comerciales: ['Zyprexa', 'Olanzapina', 'Zydis'], forma: 'Comprimidos / Inyectable', presentacion: '2.5mg, 5mg, 7.5mg, 10mg', categoria: 'Antipsicótico atípico' },
  { id: 125, generico: 'Aripiprazol', comerciales: ['Abilify', 'Aripiprazol', 'Aristada'], forma: 'Comprimidos / Solución', presentacion: '5mg, 10mg, 15mg, 30mg', categoria: 'Antipsicótico atípico' },
  { id: 126, generico: 'Haloperidol', comerciales: ['Haldol', 'Haloperidol', 'Serenace'], forma: 'Comprimidos / Gotas / Ampollas', presentacion: '1mg, 5mg, 10mg', categoria: 'Antipsicótico clásico' },
  { id: 127, generico: 'Duloxetina', comerciales: ['Cymbalta', 'Duloxetina', 'Xeristar'], forma: 'Cápsulas', presentacion: '30mg, 60mg', categoria: 'IRSN / Antidepresivo / Dolor neuropático' },
  { id: 128, generico: 'Mirtazapina', comerciales: ['Remeron', 'Mirtazapina', 'Zispin'], forma: 'Comprimidos', presentacion: '15mg, 30mg, 45mg', categoria: 'Antidepresivo noradrenérgico' },
  { id: 129, generico: 'Bupropión', comerciales: ['Wellbutrin', 'Zyban', 'Bupropión'], forma: 'Comprimidos (liberación prolongada)', presentacion: '150mg, 300mg', categoria: 'Antidepresivo / Cesación tabáquica' },
  { id: 130, generico: 'Melatonina', comerciales: ['Circadin', 'Melatonina', 'Slenyto'], forma: 'Comprimidos / Gotas', presentacion: '1mg, 2mg, 5mg, 10mg', categoria: 'Hipnótico / Regulador del sueño' },
  { id: 131, generico: 'Donepezilo', comerciales: ['Aricept', 'Donepezilo', 'Eranz'], forma: 'Comprimidos', presentacion: '5mg, 10mg', categoria: 'Inhibidor colinesterasa / Alzheimer' },
  { id: 132, generico: 'Memantina', comerciales: ['Ebixa', 'Namenda', 'Axura'], forma: 'Comprimidos / Gotas', presentacion: '5mg, 10mg, 20mg', categoria: 'Antagonista NMDA / Alzheimer' },
  { id: 133, generico: 'Sumatriptán', comerciales: ['Imigran', 'Migratriptan', 'Sumatriptán'], forma: 'Comprimidos / Spray nasal / Inyectable', presentacion: '50mg, 100mg', categoria: 'Triptán / Migraña' },

  // Respiratorio (adicionales)
  { id: 134, generico: 'Formoterol', comerciales: ['Foradil', 'Oxis', 'Atock'], forma: 'Cápsulas inhalables / Aerosol', presentacion: '12mcg', categoria: 'Broncodilatador LABA' },
  { id: 135, generico: 'Indacaterol', comerciales: ['Onbrez', 'Arcapta'], forma: 'Cápsulas inhalables', presentacion: '150mcg, 300mcg', categoria: 'Broncodilatador LABA' },
  { id: 136, generico: 'Umeclidinio', comerciales: ['Incruse', 'Incruse Ellipta'], forma: 'Polvo inhalable', presentacion: '55mcg', categoria: 'Broncodilatador LAMA' },
  { id: 137, generico: 'Budesonida + Formoterol', comerciales: ['Symbicort', 'Bufomix', 'Vannair'], forma: 'Aerosol / Polvo inhalable', presentacion: '80/4.5mcg, 160/4.5mcg', categoria: 'Corticoide inhalado + LABA' },
  { id: 138, generico: 'Fluticasona + Vilanterol', comerciales: ['Relvar Ellipta', 'Breo Ellipta'], forma: 'Polvo inhalable', presentacion: '92/22mcg, 184/22mcg', categoria: 'Corticoide inhalado + LABA' },
  { id: 139, generico: 'N-acetilcisteína', comerciales: ['Fluimucil', 'Mucolítico', 'Acetilcisteína'], forma: 'Sobres / Comprimidos efervescentes', presentacion: '200mg, 600mg', categoria: 'Mucolítico' },
  { id: 140, generico: 'Ambroxol', comerciales: ['Mucosolvan', 'Ambril', 'Ambroxol'], forma: 'Jarabe / Comprimidos / Gotas', presentacion: '15mg/5mL, 30mg, 75mg', categoria: 'Mucolítico / Expectorante' },
  { id: 141, generico: 'Bromhexina', comerciales: ['Bisolvon', 'Bromhexina', 'Fluibron'], forma: 'Comprimidos / Jarabe', presentacion: '8mg, 4mg/5mL', categoria: 'Mucolítico' },

  // Gastroenterología (adicionales)
  { id: 142, generico: 'Rabeprazol', comerciales: ['Pariet', 'Rabeprazol', 'Aciphex'], forma: 'Comprimidos', presentacion: '10mg, 20mg', categoria: 'IBP / Antiácido' },
  { id: 143, generico: 'Lansoprazol', comerciales: ['Prevacid', 'Lansox', 'Zoton'], forma: 'Cápsulas', presentacion: '15mg, 30mg', categoria: 'IBP / Antiácido' },
  { id: 144, generico: 'Esomeprazol', comerciales: ['Nexium', 'Emanera', 'Esomeprazol'], forma: 'Comprimidos / Ampollas', presentacion: '20mg, 40mg', categoria: 'IBP / Antiácido' },
  { id: 145, generico: 'Sucralfato', comerciales: ['Ulcogant', 'Sucralan', 'Sucralfato'], forma: 'Comprimidos / Suspensión', presentacion: '1g', categoria: 'Citoprotector gástrico' },
  { id: 146, generico: 'Trimebutina', comerciales: ['Debridat', 'Trimebutina'], forma: 'Comprimidos / Jarabe', presentacion: '100mg, 200mg', categoria: 'Antiespasmódico intestinal' },
  { id: 147, generico: 'Mesalazina', comerciales: ['Salofalk', 'Asacol', 'Pentasa'], forma: 'Comprimidos / Supositorios / Enema', presentacion: '250mg, 400mg, 500mg, 1g', categoria: 'Antiinflamatorio intestinal (EII)' },
  { id: 148, generico: 'Rifaximina', comerciales: ['Xifaxan', 'Normix', 'Rifaximin'], forma: 'Comprimidos', presentacion: '200mg, 400mg, 550mg', categoria: 'Antibiótico intestinal (EHE/SII)' },

  // Reumatología / MSK
  { id: 149, generico: 'Etoricoxib', comerciales: ['Arcoxia', 'Etoricoxib'], forma: 'Comprimidos', presentacion: '60mg, 90mg, 120mg', categoria: 'AINE (Cox-2 selectivo)' },
  { id: 150, generico: 'Meloxicam', comerciales: ['Mobic', 'Meloxicam', 'Movalis'], forma: 'Comprimidos / Ampollas', presentacion: '7.5mg, 15mg', categoria: 'AINE (preferente Cox-2)' },
  { id: 151, generico: 'Indometacina', comerciales: ['Indocid', 'Artrinovo', 'Indomethacin'], forma: 'Cápsulas / Supositorios', presentacion: '25mg, 50mg, 75mg', categoria: 'AINE' },
  { id: 152, generico: 'Leflunomida', comerciales: ['Arava', 'Leflunomida'], forma: 'Comprimidos', presentacion: '10mg, 20mg', categoria: 'DMARD / Artritis reumatoidea' },
  { id: 153, generico: 'Sulfasalazina', comerciales: ['Salazopyrin', 'Azulfidine', 'Sulfasalazina'], forma: 'Comprimidos', presentacion: '500mg', categoria: 'DMARD / EII' },

  // Endocrinología
  { id: 154, generico: 'Propiltiouracilo', comerciales: ['PTU', 'Propiltiouracilo'], forma: 'Comprimidos', presentacion: '50mg', categoria: 'Antitiroideos' },
  { id: 155, generico: 'Calcitrol', comerciales: ['Rocaltrol', 'Calcitrol'], forma: 'Cápsulas / Solución', presentacion: '0.25mcg, 0.5mcg', categoria: 'Vitamina D activa' },
  { id: 156, generico: 'Testosterona', comerciales: ['Nebido', 'Testex', 'Androtardyl'], forma: 'Ampollas inyectable / Gel', presentacion: '250mg/mL, 1000mg/4mL', categoria: 'Andrógeno / Terapia hormonal' },
  { id: 157, generico: 'Estrógenos conjugados', comerciales: ['Premarin', 'Climopax'], forma: 'Comprimidos / Crema', presentacion: '0.3mg, 0.625mg, 1.25mg', categoria: 'Estrógeno / Terapia hormonal' },
  { id: 158, generico: 'Progesterona micronizada', comerciales: ['Utrogestan', 'Prometrium'], forma: 'Cápsulas', presentacion: '100mg, 200mg', categoria: 'Progestágeno / Terapia hormonal' },

  // Antiinfecciosos adicionales
  { id: 159, generico: 'Fluconazol', comerciales: ['Diflucan', 'Fluderm', 'Fluconazol'], forma: 'Cápsulas / Suspensión / Ampollas', presentacion: '50mg, 100mg, 150mg, 200mg', categoria: 'Antifúngico' },
  { id: 160, generico: 'Itraconazol', comerciales: ['Sporanox', 'Itraconazol', 'Itrizole'], forma: 'Cápsulas / Solución', presentacion: '100mg', categoria: 'Antifúngico' },
  { id: 161, generico: 'Terbinafina', comerciales: ['Lamisil', 'Terbinafina', 'Micofin'], forma: 'Comprimidos / Crema', presentacion: '250mg', categoria: 'Antifúngico' },
  { id: 162, generico: 'Nitrofurantoína', comerciales: ['Macrobid', 'Macrodantina', 'Nitrofurantoína'], forma: 'Cápsulas', presentacion: '50mg, 100mg', categoria: 'Antibiótico (ITU)' },
  { id: 163, generico: 'Fosfomicina', comerciales: ['Monuril', 'Fosfomicina'], forma: 'Granulado (sobre)', presentacion: '3g', categoria: 'Antibiótico (ITU dosis única)' },
  { id: 164, generico: 'Moxifloxacina', comerciales: ['Avelox', 'Moxifloxacin', 'Actira'], forma: 'Comprimidos / Ampollas', presentacion: '400mg', categoria: 'Antibiótico (fluoroquinolona)' },
  { id: 165, generico: 'Oseltamivir', comerciales: ['Tamiflu', 'Oseltamivir'], forma: 'Cápsulas / Suspensión', presentacion: '30mg, 45mg, 75mg', categoria: 'Antiviral (influenza)' },

  // Dermatología / Tópicos
  { id: 166, generico: 'Betametasona', comerciales: ['Diprospan', 'Celestoderm', 'Betnovate'], forma: 'Crema / Ampollas inyectables', presentacion: '0.1% crema, 7mg/mL inyectable', categoria: 'Corticoide tópico/sistémico' },
  { id: 167, generico: 'Triamcinolona', comerciales: ['Kenalog', 'Kenacort', 'Triamcinolona'], forma: 'Crema / Ampollas', presentacion: '0.1% crema, 40mg/mL', categoria: 'Corticoide tópico/inyectable' },
  { id: 168, generico: 'Tacrolimus tópico', comerciales: ['Protopic'], forma: 'Ungüento', presentacion: '0.03%, 0.1%', categoria: 'Inmunomodulador tópico (dermatitis)' },

  // Hematología / Oncología soporte
  { id: 169, generico: 'Eritropoyetina', comerciales: ['Eprex', 'Recormon', 'Aranesp'], forma: 'Solución inyectable', presentacion: '2000 UI, 4000 UI, 10000 UI', categoria: 'Factor estimulante eritropoyético' },
  { id: 170, generico: 'Ácido tranexámico', comerciales: ['Transamin', 'Cyklokapron'], forma: 'Comprimidos / Ampollas', presentacion: '250mg, 500mg, 1g', categoria: 'Antifibrinolítico' },

  // Misceláneos frecuentes
  { id: 171, generico: 'Baclofeno', comerciales: ['Lioresal', 'Baclofeno'], forma: 'Comprimidos', presentacion: '10mg, 25mg', categoria: 'Relajante muscular central' },
  { id: 172, generico: 'Ciclobenzaprina', comerciales: ['Flexeril', 'Yurelax', 'Ciclobenzaprina'], forma: 'Comprimidos', presentacion: '5mg, 10mg', categoria: 'Relajante muscular' },
  { id: 173, generico: 'Tizanidina', comerciales: ['Sirdalud', 'Tizanidina', 'Zanaflex'], forma: 'Comprimidos', presentacion: '2mg, 4mg', categoria: 'Relajante muscular central' },
  { id: 174, generico: 'Oxibutinina', comerciales: ['Ditropan', 'Oxibutinina', 'Kentera'], forma: 'Comprimidos / Parche', presentacion: '5mg, 10mg', categoria: 'Anticolinérgico / Vejiga hiperactiva' },
  { id: 175, generico: 'Solifenacina', comerciales: ['Vesicare', 'Solifenacina'], forma: 'Comprimidos', presentacion: '5mg, 10mg', categoria: 'Anticolinérgico / Vejiga hiperactiva' },
  { id: 176, generico: 'Vareniclina', comerciales: ['Champix', 'Chantix'], forma: 'Comprimidos', presentacion: '0.5mg, 1mg', categoria: 'Cesación tabáquica' },
  { id: 177, generico: 'Naltrexona', comerciales: ['Revia', 'Naltrexona', 'Vivitrol'], forma: 'Comprimidos', presentacion: '50mg', categoria: 'Antagonista opioide / Dependencia alcohol' },
  { id: 178, generico: 'Hidróxido de aluminio + magnesio', comerciales: ['Maalox', 'Gelopectosa', 'Melox'], forma: 'Suspensión / Comprimidos masticables', presentacion: '400mg+400mg', categoria: 'Antiácido' },
  { id: 179, generico: 'Simeticona', comerciales: ['Mysoline', 'Gas-X', 'Lefax'], forma: 'Comprimidos / Gotas', presentacion: '40mg, 80mg', categoria: 'Antiflatulento' },
  { id: 180, generico: 'Bisacodilo', comerciales: ['Dulcolax', 'Laxoberon', 'Bisacodilo'], forma: 'Comprimidos / Supositorios', presentacion: '5mg, 10mg', categoria: 'Laxante estimulante' },
]

export function buscarMedicamento(termino: string): Medicamento[] {
  if (!termino.trim() || termino.length < 2) return []
  const t = termino.toLowerCase()
  return VADEMECUM.filter(m =>
    m.generico.toLowerCase().includes(t) ||
    m.comerciales.some(c => c.toLowerCase().includes(t)) ||
    m.categoria.toLowerCase().includes(t)
  ).slice(0, 10)
}
