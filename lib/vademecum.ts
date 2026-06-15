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
  { id: 31, generico: 'Aspirina (Ácido acetilsalicílico)', comerciales: ['Aspirina', 'Cardioaspirina', 'Adiro'], forma: 'Comprimidos', presentacion: '100mg, 325mg, 500mg', categoria: 'Antiagregante / AINE' },
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
