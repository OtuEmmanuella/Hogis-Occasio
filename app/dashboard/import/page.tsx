'use client'

import { motion } from 'framer-motion'
import { Upload, Users, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import toast from 'react-hot-toast'

const ALL_GUESTS = [
  { name: 'KENNENY NMERIBEOLE', phone: '+2348060616394', email: null, group_name: 'Hogis Guests' },
  { name: 'ETIM INYANG', phone: '+2348023135473', email: null, group_name: 'Hogis Guests' },
  { name: 'IKIP WINNER', phone: '+2347026859884', email: null, group_name: 'Hogis Guests' },
  { name: 'IROKA IFEANYI', phone: '+2348068923224', email: null, group_name: 'Hogis Guests' },
  { name: 'OBIORA EVENDU', phone: '+2348039558885', email: null, group_name: 'Hogis Guests' },
  { name: 'UDO EKWERE', phone: '+2348173957452', email: null, group_name: 'Hogis Guests' },
  { name: 'KAYODE JOHN', phone: '+2347030890898', email: null, group_name: 'Hogis Guests' },
  { name: 'MRS SABINA IWENJORA', phone: '+2348033129039', email: null, group_name: 'Hogis Guests' },
  { name: 'PATRICK FAVOUR', phone: '+2348105746465', email: null, group_name: 'Hogis Guests' },
  { name: 'USHER PAUL', phone: '+2348104115958', email: null, group_name: 'Hogis Guests' },
  { name: 'TONY EYO', phone: '+2349039057374', email: null, group_name: 'Hogis Guests' },
  { name: 'EDET EMMANUEL', phone: '+2348063751845', email: null, group_name: 'Hogis Guests' },
  { name: 'DAVID UDEME', phone: '+2347040181296', email: null, group_name: 'Hogis Guests' },
  { name: 'WILLIAMS MBEH', phone: '+2348035150254', email: null, group_name: 'Hogis Guests' },
  { name: 'ANIMPAYE MARGARD', phone: '+2348077754955', email: null, group_name: 'Hogis Guests' },
  { name: 'OSARA ELINDIAH', phone: '+2348068644837', email: null, group_name: 'Hogis Guests' },
  { name: 'IREGHA JOHN KALU', phone: '+2347065146621', email: null, group_name: 'Hogis Guests' },
  { name: 'OGU HENRY', phone: '+2348039726707', email: null, group_name: 'Hogis Guests' },
  { name: 'CHIDI-NADI EZE', phone: '+2348033663745', email: null, group_name: 'Hogis Guests' },
  { name: 'ISREAL REBULADO', phone: '+2347033697631', email: null, group_name: 'Hogis Guests' },
  { name: 'KOLADE AFI', phone: '+2348039043469', email: null, group_name: 'Hogis Guests' },
  { name: 'AKINOLA SAMSON', phone: '+2348100771245', email: null, group_name: 'Hogis Guests' },
  { name: 'CHINEDU OBINNA', phone: '+2348068889923', email: null, group_name: 'Hogis Guests' },
  { name: 'FRANCE ALINYBE', phone: '+2348036156933', email: null, group_name: 'Hogis Guests' },
  { name: 'UAURU FELIX', phone: '+2348096174403', email: null, group_name: 'Hogis Guests' },
  { name: 'LEXTECH ECOSYSTEM', phone: '+2348107499774', email: null, group_name: 'Hogis Guests' },
  { name: 'AYAM PATIENCE NDIYO', phone: '+2348129531881', email: null, group_name: 'Hogis Guests' },
  { name: 'HON JONS INGOM', phone: '+2348136544443', email: null, group_name: 'Hogis Guests' },
  { name: 'BASSEY CLINTON', phone: '+2347019445298', email: null, group_name: 'Hogis Guests' },
  { name: 'AKEM PRINCE JULIUS', phone: '+2348148818244', email: null, group_name: 'Hogis Guests' },
  { name: 'JOSEPH SAMUEL', phone: '+2348137034184', email: null, group_name: 'Hogis Guests' },
  { name: 'KAYODE SAKA', phone: '+2348155574245', email: null, group_name: 'Hogis Guests' },
  { name: 'ABRAHAM YUSUF', phone: '+2349133516873', email: null, group_name: 'Hogis Guests' },
  { name: 'IKIP OBIO', phone: '+2349163623416', email: null, group_name: 'Hogis Guests' },
  { name: 'BASSEY EKPO', phone: '+2348035356966', email: null, group_name: 'Hogis Guests' },
  { name: 'OBAJI AKPET', phone: '+2349131542130', email: null, group_name: 'Hogis Guests' },
  { name: 'JOSEPH ORIJO', phone: '+2348069211645', email: null, group_name: 'Hogis Guests' },
  { name: 'PRECIOUS OGBEMUDIA', phone: '+2349182545381', email: null, group_name: 'Hogis Guests' },
  { name: 'IRONSHO RAPHAEL', phone: '+2348066145112', email: null, group_name: 'Hogis Guests' },
  { name: 'AKPAN GODDY', phone: '+2348029382828', email: null, group_name: 'Hogis Guests' },
  { name: 'EDOH EMMA', phone: '+2349034674741', email: null, group_name: 'Hogis Guests' },
  { name: 'WISDOM IFEKENANDU', phone: '+2349065295585', email: null, group_name: 'Hogis Guests' },
  { name: 'PATIENCE ENIAYEWU', phone: '+2347037969984', email: null, group_name: 'Hogis Guests' },
  { name: 'ATIM ITA', phone: '+2349046035095', email: null, group_name: 'Hogis Guests' },
  { name: 'DUKE OTI', phone: '+2347046425465', email: 'otiduke50@gmail.com', group_name: 'Extended Network' },
  { name: 'ADAMS ISAIAH AYODEJI', phone: '+2348135308748', email: 'isaiahadams58@gmail.com', group_name: 'Extended Network' },
  { name: 'TAKON BLESSING SUNDAY', phone: '+2348050174646', email: 'takinblessing5@gmail.com', group_name: 'Extended Network' },
  { name: 'ENU EZEOBA CHIDI', phone: '+2348147477103', email: 'sunday.enu@totalenergies.com', group_name: 'Extended Network' },
  { name: 'JUDE OBIMA', phone: '+2348064751537', email: null, group_name: 'Extended Network' },
  { name: 'ONUKWE CHIMEADU', phone: '+2348037608526', email: null, group_name: 'Extended Network' },
  { name: 'WILLIE MICHEAL', phone: '+2349077258808', email: null, group_name: 'Extended Network' },
  { name: 'BARBARA', phone: '+2348168942654', email: null, group_name: 'Extended Network' },
  { name: 'EZAK JR', phone: '+2347033289086', email: 'ezakjr81@gmail.com', group_name: 'Extended Network' },
  { name: 'SAMUEL SMART UKWAYI', phone: '+2348117389458', email: 'emmanuelsmart111@yahoo.com', group_name: 'Extended Network' },
  { name: 'NICKY', phone: '+2348035203181', email: 'nickyaglauk@gmail.com', group_name: 'Extended Network' },
  { name: 'ENIM DORRIAN', phone: '+2348030862452', email: 'enimdorian@gmail.com', group_name: 'Extended Network' },
  { name: 'HANS BASSEY', phone: '+2348064232472', email: null, group_name: 'Extended Network' },
  { name: 'JOEKIM EDIDIONG', phone: '+2348165532398', email: null, group_name: 'Extended Network' },
  { name: 'CHARLES KUMOLU', phone: '+2347043123707', email: null, group_name: 'Extended Network' },
  { name: 'MR OLABANJI ALIMI', phone: '+2348131143342', email: null, group_name: 'Extended Network' },
  { name: 'OTU OTU ITA', phone: '+2348158490402', email: null, group_name: 'Extended Network' },
  { name: 'PRINCES CHINONSO', phone: '+2348062139067', email: null, group_name: 'Extended Network' },
  { name: 'OGWU ANTHONY', phone: '+2348026227467', email: 'tony.ogwu@yahoo.com', group_name: 'Extended Network' },
  { name: 'MS NNENA', phone: '+2348182802584', email: null, group_name: 'Extended Network' },
  { name: 'ONOCHIE ANIBEZE KEN', phone: '+2348033044511', email: 'onibeze@yahoo.com', group_name: 'Extended Network' },
  { name: 'OLISA CHUKWUMA', phone: '+2348033034924', email: null, group_name: 'Extended Network' },
  { name: 'DEBORAH OJONG OKON UFOR', phone: '+2348023145305', email: 'deborahojong16@gmail.com', group_name: 'Extended Network' },
  { name: 'JUNAID RIDWAN', phone: '+2347034971884', email: null, group_name: 'Extended Network' },
  { name: 'ENGR ISAAC', phone: '+2348103733417', email: null, group_name: 'Extended Network' },
  { name: 'IBE ETEA', phone: '+2347038950412', email: 'ibe.etea@mtn.com', group_name: 'Extended Network' },
  { name: 'EMMANUEL NTUEN', phone: '+2348159530964', email: null, group_name: 'Extended Network' },
  { name: 'DAVID TOM', phone: '+2349030129522', email: 'davasid44@gmail.com', group_name: 'Extended Network' },
  { name: 'EMMANUEL ETTA', phone: '+2348023123835', email: 'ukpeemma@gmail.com', group_name: 'Extended Network' },
  { name: 'DR ORJI DAVID', phone: '+2348133560280', email: 'drorjidavid@gmail.com', group_name: 'Extended Network' },
  { name: 'FRED HARRY', phone: '+2348037560234', email: null, group_name: 'Extended Network' },
  { name: 'MODUPE SEGUN', phone: '+2347034660654', email: 'domoseg@yahoo.com', group_name: 'Extended Network' },
  { name: 'CHISOM AJAERO', phone: '+2348177260871', email: null, group_name: 'Extended Network' },
  { name: 'AMB STEPHEN', phone: '+2347040804511', email: null, group_name: 'Extended Network' },
  { name: 'PRINCE SAMUEL', phone: '+2348035203181', email: null, group_name: 'Extended Network' },
  { name: 'SAMUEL BESONG', phone: '+2348030862452', email: 'sbesong@desu.edu', group_name: 'Extended Network' },
  { name: 'CHINEDU MACDAVIDSON', phone: '+2348168942654', email: 'macblinky21@gmail.com', group_name: 'Extended Network' },
  { name: 'JUDE WISDOM', phone: '+2349066124182', email: 'sammy.eja@gmail.com', group_name: 'Extended Network' },
  { name: 'BASSEY FIDELITY', phone: '+2348066482312', email: 'nsikakekure@yahoo.com', group_name: 'Extended Network' },
  { name: 'DR SAM EJA', phone: '+2348033291423', email: 'viconos@yahoo.com', group_name: 'Extended Network' },
  { name: 'ROSEMARY', phone: '+2348032000467', email: 'lifeofschaal@gmail.com', group_name: 'Extended Network' },
  { name: 'EKWERE TITUS', phone: '+2348061329725', email: null, group_name: 'Extended Network' },
  { name: 'NKEM KELVIN', phone: '+2348060987751', email: null, group_name: 'Extended Network' },
  { name: 'DR VICTOR ONONOKPONO', phone: '+2348034063189', email: null, group_name: 'Extended Network' },
  { name: 'OFFIONG', phone: '+2348130251969', email: null, group_name: 'Extended Network' },
  { name: 'NWAFOR PASCAL', phone: '+2348065472573', email: null, group_name: 'Extended Network' },
  { name: 'MIMI EDET', phone: '+2348035484243', email: null, group_name: 'Extended Network' },
  { name: 'EMMANUEL INYANG', phone: '+2348075579123', email: null, group_name: 'Extended Network' },
  { name: 'PRISCILLIA OBI', phone: '+2348023128560', email: 'obipriscillia6@gmail.com', group_name: 'Extended Network' },
  { name: 'FRANKLYN EDET', phone: '+2348161207887', email: 'franklynedet@gmail.com', group_name: 'Extended Network' },
  { name: 'EMMANUEL SMART', phone: '+2348037445617', email: 'emmanuelsmart11@yahoo.com', group_name: 'Extended Network' },
  { name: 'NICKY AGLA', phone: '+2349071258808', email: null, group_name: 'Extended Network' },
  { name: 'GODWIN SOMTO', phone: '+2349118924434', email: null, group_name: 'Extended Network' },
  { name: 'SOPHIA OMINI', phone: '+2348064813110', email: null, group_name: 'Extended Network' },
  { name: 'LEXTECH ECOSYSTEM 2', phone: '+2348033168999', email: null, group_name: 'Extended Network' },
  { name: 'DR OHAEQQBUCH', phone: '+2348054174647', email: null, group_name: 'Extended Network' },
  { name: 'AYODEJI OHIKWE', phone: '+2348147477103', email: 'ayodejiohikwe@gmail.com', group_name: 'Extended Network' },
  { name: 'BLESSING TAKON', phone: '+2348033589770', email: 'takonblessing5@gmail.com', group_name: 'Extended Network' },
  { name: 'LAWRENCE EWAH', phone: '+2348099428882', email: 'larryuno@gmail.com', group_name: 'Extended Network' },
  { name: 'LEE O DAVID PAUL', phone: '+2347046323593', email: null, group_name: 'Extended Network' },
  { name: 'FEMI SHITTU', phone: '+2348037055117', email: null, group_name: 'Extended Network' },
  { name: 'ENO HENSHAW', phone: '+2348054202354', email: 'eonhanson@gmail.com', group_name: 'Extended Network' },
  { name: 'BENJAMIN EFFIONG', phone: '+2348037680432', email: 'basseybenjamin@gmail.com', group_name: 'Extended Network' },
  { name: 'OGU HENRY', phone: '+2348023940765', email: null, group_name: 'Extended Network' },
  { name: 'IDA EKEREKE', phone: '+2348062825242', email: null, group_name: 'Extended Network' },
  { name: 'MOHAMMED AHMED', phone: '+2348065609861', email: null, group_name: 'Extended Network' },
  { name: 'OKPARA OGBONNA', phone: '+2349047170480', email: null, group_name: 'Extended Network' },
  { name: 'ISOKON EGBE', phone: '+2348132288153', email: null, group_name: 'Extended Network' },
  { name: 'INIBEGHE ABRAHAM', phone: '+2348153493879', email: 'inibegheabraham@gmail.com', group_name: 'Extended Network' },
  { name: 'ADAH EBERE', phone: '+2348117389458', email: null, group_name: 'Extended Network' },
  { name: 'BARBARA ETENG', phone: '+2348035584474', email: 'barbaraeteng10@gmail.com', group_name: 'Extended Network' },
  { name: 'EZEK JUNIOR', phone: '+2348034347161', email: 'ezakjr81@gmail.com', group_name: 'Extended Network' },
  { name: 'DAVID DISI', phone: '+2349096533406', email: null, group_name: 'Extended Network' },
  { name: 'KAYODE AKINADE', phone: '+2349077776792', email: null, group_name: 'Extended Network' },
  { name: 'EMMANUEL ESSIE', phone: '+2348102754825', email: null, group_name: 'Extended Network' },
  { name: 'BABATOLA OLAGBE', phone: '+2348144484913', email: null, group_name: 'Extended Network' },
  { name: 'AGBARA C ISAAC AJISAFE', phone: '+2348036006418', email: 'isaacajisafe2002@gmail.com', group_name: 'Extended Network' },
  { name: 'LINDA ONYE', phone: '+2348143342104', email: null, group_name: 'Extended Network' },
  { name: 'DAVIS BELLO', phone: '+2347035252159', email: null, group_name: 'Extended Network' },
  { name: 'RASA MFON', phone: '+2348034694040', email: null, group_name: 'Extended Network' },
  { name: 'GMA SUCESS', phone: '+2348057102731', email: null, group_name: 'Extended Network' },
  { name: 'VICTOR GOODNESS', phone: '+2347045333300', email: null, group_name: 'Extended Network' },
  { name: 'ENANG EMMANUEL INAM', phone: '+2349116206845', email: null, group_name: 'Extended Network' },
  { name: 'OLA ADIE', phone: '+2349166982440', email: 'olanleakinla@gmail.com', group_name: 'Extended Network' },
  { name: 'TIMOTHY ATILABI', phone: '+2347056434700', email: null, group_name: 'Extended Network' },
  { name: 'WISDOM FRIDAY', phone: '+2349161403843', email: null, group_name: 'Extended Network' },
  { name: 'CHUKWUEMEKA GODSON', phone: '+2348023026926', email: null, group_name: 'Extended Network' },
  { name: 'SANUSI RISKABU', phone: '+2348036544382', email: null, group_name: 'Extended Network' },
  { name: 'DAMILOLA DOSUMU', phone: '+2348033154243', email: null, group_name: 'Extended Network' },
  { name: 'JIMMY DUBEM', phone: '+2348065782414', email: null, group_name: 'Extended Network' },
  { name: 'TOPE FASORANRI', phone: '+2348037223935', email: null, group_name: 'Extended Network' },
  { name: 'MARTINS FAKROGHA', phone: '+2348028628634', email: null, group_name: 'Extended Network' },
  { name: 'AKINLOLU AKINYINKA', phone: '+2349022738993', email: null, group_name: 'Extended Network' },
  { name: 'CHRISTOPHER EDUMUJE', phone: '+2347030460480', email: null, group_name: 'Extended Network' },
  { name: 'SAMUEL OKON', phone: '+2349034494808', email: null, group_name: 'Extended Network' },
  { name: 'HENE ENYI', phone: '+2348025931516', email: null, group_name: 'Extended Network' },
  { name: 'MARVELLOUS IKE', phone: '+2348066965912', email: 'ikeeqbuenumarvellous@gmail.com', group_name: 'Extended Network' },
  { name: 'MOSES KELVIN', phone: '+2348117949314', email: null, group_name: 'Extended Network' },
  { name: 'PATRICK MICHAEL', phone: '+2348131937082', email: null, group_name: 'Extended Network' },
  { name: 'E O ZAMMY', phone: '+2348037775777', email: null, group_name: 'Extended Network' },
  { name: 'EKEMINI ANTHONY PAUL', phone: '+2348035524020', email: null, group_name: 'Extended Network' },
  { name: 'OBI DENWIGWE', phone: '+2348029193331', email: null, group_name: 'Extended Network' },
  { name: 'FATUNE UDEME', phone: '+2348037199728', email: null, group_name: 'Extended Network' },
  { name: 'OVAT EDEM', phone: '+2348166829363', email: null, group_name: 'Extended Network' },
  { name: 'OFEM JESAM', phone: '+2348168393982', email: null, group_name: 'Extended Network' },
  { name: 'ADAM BABA', phone: '+2349042996916', email: 'adamidris007@gmail.com', group_name: 'Extended Network' },
  { name: 'IMEH ANIEBIET', phone: '+2348069603395', email: null, group_name: 'Extended Network' },
  { name: 'JOHN IDAKA', phone: '+2349063125259', email: 'johnidaka@yahoo.com', group_name: 'Extended Network' },
  { name: 'NICHOLAS EGBENTA', phone: '+2348180102131', email: null, group_name: 'Extended Network' },
  { name: 'ETIM EFFANGA', phone: '+2348057422156', email: null, group_name: 'Extended Network' },
  { name: 'EKENG HENSHAW', phone: '+2348168237115', email: null, group_name: 'Extended Network' },
  { name: 'EMMANUEL PASLAIDO', phone: '+2349091513062', email: null, group_name: 'Extended Network' },
  { name: 'DELWOLA A GOSPEL', phone: '+2348029506763', email: null, group_name: 'Extended Network' },
  { name: 'PROMISE EMENIKE', phone: '+2347036542418', email: null, group_name: 'Extended Network' },
  { name: 'OPUSUNJU ISAAC', phone: '+2348132764378', email: 'isaacopusunju932@gmail.com', group_name: 'Extended Network' },
  { name: 'EROH OJIE', phone: '+2347064929763', email: null, group_name: 'Extended Network' },
  { name: 'QUEEN UDOH', phone: '+2348025740584', email: null, group_name: 'Extended Network' },
  { name: 'WALTERS KETO', phone: '+2347025084979', email: null, group_name: 'Extended Network' },
  { name: 'MR ETTAHH', phone: '+2348144186941', email: null, group_name: 'Extended Network' },
  { name: 'ITA ATTING', phone: '+2348035073011', email: null, group_name: 'Extended Network' },
  { name: 'CHUKWUDI OKEREKE', phone: '+2348037105080', email: 'chokereke@gmail.com', group_name: 'Extended Network' },
  { name: 'KELLY EGUMATU', phone: '+2348022225486', email: 'egumatukelly@gmail.com', group_name: 'Extended Network' },
  { name: 'KELVIN KINGSLEY', phone: '+2347075326952', email: null, group_name: 'Extended Network' },
  { name: 'UDUAK FRIDAY', phone: '+2348068282750', email: null, group_name: 'Extended Network' },
  { name: 'OSAKUE CHIMERE', phone: '+2348135259620', email: null, group_name: 'Extended Network' },
  { name: 'ENGR JOSHUA', phone: '+2348035757991', email: null, group_name: 'Extended Network' },
  { name: 'PATRRICK OBALUM', phone: '+2349134495516', email: 'pato4chelstaeng@gmail.com', group_name: 'Extended Network' },
  { name: 'JIBRIL ISHAQ', phone: '+2349073548690', email: null, group_name: 'Extended Network' },
  { name: 'ESTHER AGORIAT', phone: '+2348072582411', email: 'estheragoriat@rescue.org', group_name: 'Extended Network' },
  { name: 'KENECHI ONGOHA', phone: '+2348130382834', email: 'onuohakp@gmail.com', group_name: 'Extended Network' },
  { name: 'UDE EMMANUEL', phone: '+2348109110957', email: 'chizaz2017@gmail.com', group_name: 'Extended Network' },
  { name: 'DIETER VAN MOORHEM', phone: '+2348185780693', email: 'dieter.vanmoorhem@un.org', group_name: 'Extended Network' },
  { name: 'OBAYUWANA CONFIDENCE', phone: '+2348017118469', email: 'obayuwanaconfidence@gmail.com', group_name: 'Extended Network' },
  { name: 'VICTOR FRIDAY', phone: '+2349133862128', email: null, group_name: 'Extended Network' },
  { name: 'PETER RICE', phone: '+2348062586203', email: 'peter.rice@un.org', group_name: 'Extended Network' },
  { name: 'PRECIOUS SAM', phone: '+2348033885779', email: 'samprecious48@gmail.com', group_name: 'Extended Network' },
  { name: 'AMIN MAGASHI', phone: '+2348059062929', email: null, group_name: 'Extended Network' },
  { name: 'NDUBISI ANYANNE', phone: '+2348137334237', email: 'ndubisia@gmail.com', group_name: 'Extended Network' },
  { name: 'LAWRENCE ODEY', phone: '+2347037771215', email: null, group_name: 'Extended Network' },
  { name: 'LAWSON JACK', phone: '+2347053224897', email: 'tonyeklawsonjack@yahoo.com', group_name: 'Extended Network' },
  { name: 'KURA BABA', phone: '+2348034586418', email: 'gbabakura@gmail.com', group_name: 'Extended Network' },
  { name: 'BIG JIGGA', phone: '+2348169602854', email: null, group_name: 'Extended Network' },
  { name: 'PETER BELLO', phone: '+2348181010420', email: 'pekatintl@yahoo.com', group_name: 'Extended Network' },
  { name: 'KENNETH OKAFOR', phone: '+2348036775850', email: null, group_name: 'Extended Network' },
  { name: 'LAWAL SOLOMON', phone: '+2348154319247', email: 'figaroperfect@gmail.com', group_name: 'Extended Network' },
  { name: 'SANNI ALIYU', phone: '+2348136570335', email: null, group_name: 'Extended Network' },
  { name: 'ESUABANA ASANYE', phone: '+2347033569001', email: null, group_name: 'Extended Network' },
  { name: 'GODSWILL OBINNA', phone: '+2347067919617', email: null, group_name: 'Extended Network' },
  { name: 'ADAM UDOESSIEN', phone: '+2349020609370', email: 'adamessien@yahoo.com', group_name: 'Extended Network' },
  { name: 'ETIM EDEM', phone: '+2349032700558', email: null, group_name: 'Extended Network' },
  { name: 'OKOPIDO EKOMS', phone: '+2348102920866', email: null, group_name: 'Extended Network' },
  { name: 'HAJIYA RALIMA', phone: '+2348068488328', email: 'rameygabs@gmail.com', group_name: 'Extended Network' },
  { name: 'ELIZABETH FERDINAND', phone: '+2348141818825', email: null, group_name: 'Extended Network' },
  { name: 'DAVID AYO', phone: '+2347085078826', email: 'davidenang36@gmail.com', group_name: 'Extended Network' },
  { name: 'JOHN OKAFOR', phone: '+2348033242878', email: null, group_name: 'Extended Network' },
  { name: 'MICHAEL OFFIONG', phone: '+2347025217186', email: 'moffiong1@gmail.com', group_name: 'Extended Network' },
  { name: 'OICE EYO', phone: '+2348169752622', email: null, group_name: 'Extended Network' },
  { name: 'JUSTINA EDET', phone: '+2349123354826', email: null, group_name: 'Extended Network' },
  { name: 'EWA KENNETH', phone: '+2348039307539', email: null, group_name: 'Extended Network' },
  { name: 'BRIGHT OJA', phone: '+2348037569072', email: null, group_name: 'Extended Network' },
  { name: 'LEGLIA ODU', phone: '+2348160574802', email: null, group_name: 'Extended Network' },
  { name: 'INIBEHE EFFIONG', phone: '+2348065142135', email: null, group_name: 'Extended Network' },
  { name: 'UF GWANDU', phone: '+2348022235803', email: 'whytprince@yahoo.com', group_name: 'Extended Network' },
  { name: 'MR TORHEMBA TYOKYAA', phone: '+2348065691002', email: null, group_name: 'Organisations' },
  { name: 'MRS FUMIFER', phone: '+2347069073126', email: null, group_name: 'Organisations' },
  { name: 'MR ALVAN ABI', phone: '+2347030208588', email: null, group_name: 'Organisations' },
  { name: 'MRS GLORIA', phone: '+2348020520106', email: null, group_name: 'Organisations' },
  { name: 'MRS TEMITOPE', phone: '+2347030128426', email: null, group_name: 'Organisations' },
  { name: 'MR EMMANUEL', phone: '+2348036287392', email: null, group_name: 'Organisations' },
  { name: 'MR BODE', phone: '+2347034013620', email: null, group_name: 'Organisations' },
  { name: 'MR IBRAHIM', phone: '+2347068628967', email: null, group_name: 'Organisations' },
  { name: 'MRS SANTA', phone: '+2349169855391', email: null, group_name: 'Organisations' },
  { name: 'MR OLAMIDE', phone: '+2348108272043', email: null, group_name: 'Organisations' },
  { name: 'MRS HELEN', phone: '+2348030616115', email: null, group_name: 'Organisations' },
  { name: 'MR WILLIAMS', phone: '+2347035602064', email: null, group_name: 'Organisations' },
  { name: 'MISS AGU AMA', phone: '+2347067677607', email: null, group_name: 'Organisations' },
  { name: 'MR SAVIOUR', phone: '+2348037264860', email: null, group_name: 'Organisations' },
  { name: 'PATIENCE EKUNKE', phone: '+2349043886810', email: null, group_name: 'Calabar Network' },
  { name: 'DAMINABO ISAAC', phone: '+2348132923189', email: null, group_name: 'Calabar Network' },
  { name: 'AKAH MICHEAL', phone: '+2348101190847', email: null, group_name: 'Calabar Network' },
  { name: 'JENNIFER NGAM', phone: '+2349061485100', email: 'jenniferngam@gmail.com', group_name: 'Calabar Network' },
  { name: 'NGAUW NGOZIKA', phone: '+2349070980730', email: null, group_name: 'Calabar Network' },
  { name: 'ANDERSON AKPAN', phone: '+2348073294528', email: null, group_name: 'Calabar Network' },
  { name: 'PRINCE ELI', phone: '+2348025674139', email: null, group_name: 'Calabar Network' },
  { name: 'AKANJI MAC-ELLIOT', phone: '+2348167889930', email: null, group_name: 'Calabar Network' },
  { name: 'DONALD JOHN', phone: '+2347039430776', email: null, group_name: 'Calabar Network' },
  { name: 'OGOR JACOB', phone: '+2348066060380', email: null, group_name: 'Calabar Network' },
  { name: 'ANTHONIA ANTHONY', phone: '+2348084601189', email: null, group_name: 'Calabar Network' },
  { name: 'PRINCE NELSON', phone: '+2348066234082', email: null, group_name: 'Calabar Network' },
  { name: 'HIGH CHIEF TABE', phone: '+2348033332593', email: null, group_name: 'Calabar Network' },
  { name: 'EMMANUEL OVAH', phone: '+2347030244782', email: null, group_name: 'Calabar Network' },
  { name: 'JENNY ASO', phone: '+2347085938809', email: null, group_name: 'Calabar Network' },
  { name: 'HENRY NWABUGWU', phone: '+2347774260059', email: null, group_name: 'Calabar Network' },
  { name: 'ADE PAUL', phone: '+2348104612832', email: null, group_name: 'Calabar Network' },
  { name: 'COLLINS PETERS', phone: '+2347034154270', email: null, group_name: 'Calabar Network' },
  { name: 'OVO JONATHAN', phone: '+2348067127996', email: null, group_name: 'Calabar Network' },
  { name: 'EMMANUEL EDWARD', phone: '+2349030866378', email: null, group_name: 'Calabar Network' },
  { name: 'PHILIP ELILEBO', phone: '+2348134751370', email: null, group_name: 'Calabar Network' },
  { name: 'OLIVER NJOR', phone: '+2348033135431', email: null, group_name: 'Calabar Network' },
  { name: 'ABRAHAM ADAJI', phone: '+2348063469948', email: null, group_name: 'Calabar Network' },
  { name: 'ZITE GRACE', phone: '+2348085410366', email: 'grazita@gmail.com', group_name: 'Calabar Network' },
  { name: 'PROMISE CHIGAMEZU', phone: '+2349055048051', email: null, group_name: 'Calabar Network' },
  { name: 'OBIALO UGOCHUKWU', phone: '+2349087111000', email: null, group_name: 'Calabar Network' },
  { name: 'OWOKONIAN QUDUS', phone: '+2348161389714', email: null, group_name: 'Calabar Network' },
  { name: 'KANU OKO', phone: '+2348076666799', email: null, group_name: 'Calabar Network' },
  { name: 'UCHENDE KOSISOCHUKWU', phone: '+2349036224830', email: null, group_name: 'Calabar Network' },
  { name: 'CHUKUWUD ELLIOT', phone: '+2347030527637', email: null, group_name: 'Calabar Network' },
  { name: 'DR PAUL ADE', phone: '+2347037462110', email: null, group_name: 'Calabar Network' },
  { name: 'NDIFREKE UBOM', phone: '+2348135357165', email: null, group_name: 'Calabar Network' },
  { name: 'EMMANUEL EFFIOK', phone: '+2348184283232', email: null, group_name: 'Calabar Network' },
  { name: 'EUGENE AYA', phone: '+2347068104689', email: null, group_name: 'Calabar Network' },
  { name: 'ITIUNGBE RITA', phone: '+2349131817436', email: 'ritamajestyi@gmail.com', group_name: 'Calabar Network' },
  { name: 'UGOJI CHINONSO', phone: '+2348118684940', email: null, group_name: 'Calabar Network' },
  { name: 'DARLINGTON AMECHI', phone: '+2348030612888', email: null, group_name: 'Calabar Network' },
  { name: 'OTOBONG THOMAS', phone: '+2348185240399', email: null, group_name: 'Calabar Network' },
  { name: 'EKEMINI OBOK', phone: '+2348133304788', email: null, group_name: 'Calabar Network' },
  { name: 'LAWAL ASHAFA', phone: '+2347039246008', email: null, group_name: 'Calabar Network' },
  { name: 'BENJAMIN IBHA', phone: '+2347048099237', email: null, group_name: 'Calabar Network' },
  { name: 'EMMANUEL OMIN', phone: '+2349046162849', email: null, group_name: 'Calabar Network' },
  { name: 'BENEDETET MARY', phone: '+2349048977421', email: null, group_name: 'Calabar Network' },
  { name: 'JACKSON NAPHATALI', phone: '+2348065122437', email: null, group_name: 'Calabar Network' },
  { name: 'JOHNLAW OBONG', phone: '+2347086647070', email: null, group_name: 'Calabar Network' },
  { name: 'ANITA NJOR', phone: '+2348130102830', email: null, group_name: 'Calabar Network' },
  { name: 'ITA ISAAC', phone: '+2348020963624', email: null, group_name: 'Calabar Network' },
  { name: 'GRACE JACKSON', phone: '+2347080404686', email: null, group_name: 'Calabar Network' },
  { name: 'APIH UBI', phone: '+2348039450768', email: null, group_name: 'Calabar Network' },
  { name: 'JORGE ETIBENG', phone: '+2348034254126', email: null, group_name: 'Calabar Network' },
  { name: 'MEDIATRICE BARENGAYABO', phone: '+2347035312324', email: null, group_name: 'Calabar Network' },
  { name: 'AHMED AHMED', phone: '+2348084171502', email: null, group_name: 'Calabar Network' },
  { name: 'RICHARD INGWE', phone: '+2349132393322', email: null, group_name: 'Calabar Network' },
  { name: 'STANLEY SUNDAY', phone: '+2347047375594', email: null, group_name: 'Calabar Network' },
  { name: 'OLAKAREM FEMI', phone: '+2347030718858', email: null, group_name: 'Calabar Network' },
  { name: 'EMMANUEL UGBE', phone: '+2349026471432', email: null, group_name: 'Calabar Network' },
  { name: 'ANYATUNG FRANCIS', phone: '+2349071306097', email: null, group_name: 'Calabar Network' },
  { name: 'SUNDAY IMUH', phone: '+2348060822862', email: null, group_name: 'Calabar Network' },
  { name: 'GODSWILL OFFIONG', phone: '+2349079684048', email: null, group_name: 'Calabar Network' },
  { name: 'IMBUTE MARY', phone: '+2347048126661', email: null, group_name: 'Calabar Network' },
  { name: 'PEDRO ABAYOMI', phone: '+2347037925390', email: null, group_name: 'Calabar Network' },
  { name: 'HOTSSAN KAROH', phone: '+2348035014211', email: null, group_name: 'Calabar Network' },
  { name: 'KUSI TUNDA', phone: '+2347034466790', email: null, group_name: 'Calabar Network' },
  { name: 'ITOHOWO JACOB', phone: '+2349073100473', email: null, group_name: 'Calabar Network' },
  { name: 'NSIKAK OKON', phone: '+2347037971978', email: null, group_name: 'Calabar Network' },
  { name: 'EMMANUEL MBANG', phone: '+2348063339739', email: null, group_name: 'Calabar Network' },
  { name: 'YUNANA MARKUSBARDE', phone: '+2347041736870', email: null, group_name: 'Calabar Network' },
  { name: 'OKORO DAVID', phone: '+2348064843420', email: null, group_name: 'Calabar Network' },
  { name: 'SAMUEL IRONBAR', phone: '+2347039689522', email: null, group_name: 'Calabar Network' },
  { name: 'CHIJIOKE OKOLI', phone: '+2348061289403', email: null, group_name: 'Calabar Network' },
  { name: 'UCHECHUKWU CHUKWUANO', phone: '+2348136347804', email: null, group_name: 'Calabar Network' },
  { name: 'EFFIONG KATE', phone: '+2348037662198', email: null, group_name: 'Calabar Network' },
  { name: 'BASSEY ABASIFREKE', phone: '+2349064331744', email: null, group_name: 'Calabar Network' },
  { name: 'PEARL DAVID', phone: '+2347035671432', email: null, group_name: 'Calabar Network' },
  { name: 'CHIAMAKA NJOKU', phone: '+2348093545389', email: null, group_name: 'Calabar Network' },
  { name: 'OSIBA EMMANUEL', phone: '+2348167729142', email: null, group_name: 'Calabar Network' },
  { name: 'EMINJE EMINUJE', phone: '+2346785254578', email: null, group_name: 'Calabar Network' },
  { name: 'EKPENYONG EYO', phone: '+2347035690862', email: null, group_name: 'Calabar Network' },
  { name: 'ADIE OKO', phone: '+2348126192528', email: null, group_name: 'Calabar Network' },
  { name: 'CHERYC SUNDAY', phone: '+2348121867143', email: null, group_name: 'Calabar Network' },
  { name: 'VICTOR BASOLA', phone: '+2347035121346', email: null, group_name: 'Calabar Network' },
  { name: 'ARIA ALLEN', phone: '+2348145884866', email: null, group_name: 'Calabar Network' },
  { name: 'AJALRO UGO', phone: '+2348037242353', email: null, group_name: 'Calabar Network' },
  { name: 'CHRIS ODEY', phone: '+2348099446647', email: null, group_name: 'Calabar Network' },
  { name: 'TITA DANKWA', phone: '+2348036185582', email: null, group_name: 'Calabar Network' },
  { name: 'ESTEL ANKPA', phone: '+2348035984847', email: null, group_name: 'Calabar Network' },
  { name: 'OLUWATOYIN OTITOJI', phone: '+2348191122057', email: null, group_name: 'Calabar Network' },
  { name: 'ESTHER IKE', phone: '+2348167859126', email: null, group_name: 'Calabar Network' },
  { name: 'MARTIN ROSEMARY', phone: '+2349131771264', email: null, group_name: 'Calabar Network' },
  { name: 'GRACE DOMINION', phone: '+2349026306326', email: null, group_name: 'Calabar Network' },
  { name: 'EFFIONG JAMES', phone: '+2347079491443', email: null, group_name: 'Calabar Network' },
  { name: 'CHIDERA EMMANUEL', phone: '+2348132023124', email: null, group_name: 'Calabar Network' },
  { name: 'EXPENSIVE ERNEST', phone: '+2348132582937', email: null, group_name: 'Calabar Network' },
  { name: 'MUKNAAN NSHE', phone: '+2347032199696', email: 'mnshe@channigeria.org.ng', group_name: 'Calabar Network' },
  { name: 'MBUOTIDEM UBOM', phone: '+2347067043423', email: null, group_name: 'Calabar Network' },
  { name: 'VICTOR ADEDIRAN', phone: '+2348037724665', email: null, group_name: 'Calabar Network' },
  { name: 'GIDEAN ESSIEN', phone: '+2349161124104', email: null, group_name: 'Calabar Network' },
  { name: 'TESLIN ABDULGAN', phone: '+2347031240881', email: null, group_name: 'Calabar Network' },
  { name: 'EMMANUEL KELVIN', phone: '+2347061739088', email: null, group_name: 'Calabar Network' },
  { name: 'XCENZ IDENTS', phone: '+2348066081330', email: null, group_name: 'Calabar Network' },
  { name: 'CELESTINE AKAHOMHEN', phone: '+2347030860699', email: null, group_name: 'Calabar Network' },
  { name: 'EJINO VALENTINE', phone: '+2347080244962', email: null, group_name: 'Calabar Network' },
  { name: 'OTTOR JOSHUA', phone: '+2348063357920', email: null, group_name: 'Calabar Network' },
  { name: 'EKENG ANAM-NDN', phone: '+2348033737249', email: 'anamekeng@yahoo.com', group_name: 'Calabar Network' },
  { name: 'OLUYBENI KOLAWOLE', phone: '+2348133685430', email: null, group_name: 'Calabar Network' },
  { name: 'NWANKWO EMMANUEL', phone: '+2348142084734', email: null, group_name: 'Calabar Network' },
  { name: 'ABUBAKAR ABUBAKAR', phone: '+2348035554385', email: null, group_name: 'Calabar Network' },
  { name: 'DANIEL RUSSEL', phone: '+2348082952608', email: null, group_name: 'Calabar Network' },
  { name: 'FRIDAY GIFT', phone: '+2348169134163', email: null, group_name: 'Calabar Network' },
  { name: 'CHIGOZE OGBE', phone: '+2348035774514', email: null, group_name: 'Calabar Network' },
]

const GROUPS = [
  { name: 'Hogis Guests', count: 44 },
  { name: 'Extended Network', count: 163 },
  { name: 'Organisations', count: 14 },
  { name: 'Calabar Network', count: 110 },
]

export default function ImportPage() {
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ imported: number } | null>(null)
  const [selectedGroups, setSelectedGroups] = useState<string[]>([...GROUPS.map(g => g.name)])
  const [preview, setPreview] = useState(false)

  const toggleGroup = (name: string) => {
    setSelectedGroups(prev =>
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    )
  }

  const guestsToImport = ALL_GUESTS.filter(g => selectedGroups.includes(g.group_name))

  const handleImport = async () => {
    if (guestsToImport.length === 0) { toast.error('Select at least one group'); return }
    setImporting(true)
    try {
      const res = await fetch('/api/import-guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guests: guestsToImport }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Import failed')
      setResult({ imported: data.imported })
      toast.success(`Successfully imported ${data.imported} guests!`)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setImporting(false)
    }
  }

  return (
    <>
      <Header title="IMPORT GUESTS" subtitle="Bulk import all guest lists into the system" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-3xl mx-auto space-y-6">

          {result ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 text-center" style={{ border: '1px solid rgba(0,255,136,0.3)' }}>
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(0,255,136,0.1)', border: '2px solid rgba(0,255,136,0.4)' }}>
                <CheckCircle size={48} style={{ color: '#00ff88', filter: 'drop-shadow(0 0 15px #00ff88)' }} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                IMPORT COMPLETE
              </h2>
              <div className="text-5xl font-bold my-6" style={{ color: '#00ff88', fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 20px #00ff88' }}>
                {result.imported}
              </div>
              <p className="text-sm mb-8" style={{ color: 'rgba(230,237,243,0.4)' }}>guests imported successfully</p>
              <div className="flex gap-3 justify-center">
                <a href="/dashboard/guests"><button className="btn-neon-solid"><Users size={14} /> VIEW GUESTS</button></a>
                <button onClick={() => setResult(null)} className="btn-neon">Import More</button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Info */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5"
                style={{ border: '1px solid rgba(0,245,255,0.15)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)' }}>
                    <Upload size={22} style={{ color: '#00f5ff' }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Bulk Guest Import — {ALL_GUESTS.length} Guests Ready</h3>
                    <p className="text-xs" style={{ color: 'rgba(230,237,243,0.5)' }}>
                      All phone numbers are formatted to +234 Nigerian format automatically.
                      Select which groups to import below.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Group selector */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5">
                <div className="section-label mb-4">SELECT GROUPS TO IMPORT</div>
                <div className="grid grid-cols-2 gap-3">
                  {GROUPS.map(g => (
                    <button key={g.name} onClick={() => toggleGroup(g.name)}
                      className="flex items-center justify-between p-4 rounded-xl text-left transition-all"
                      style={{
                        background: selectedGroups.includes(g.name) ? 'rgba(0,245,255,0.08)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${selectedGroups.includes(g.name) ? 'rgba(0,245,255,0.35)' : 'rgba(255,255,255,0.06)'}`,
                      }}>
                      <div>
                        <p className="text-sm font-medium text-white">{g.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(230,237,243,0.4)' }}>{g.count} guests</p>
                      </div>
                      {selectedGroups.includes(g.name) && <CheckCircle size={16} style={{ color: '#00f5ff' }} />}
                    </button>
                  ))}
                </div>
                <p className="text-xs mt-3" style={{ color: 'rgba(230,237,243,0.3)' }}>
                  {guestsToImport.length} guests selected for import
                </p>
              </motion.div>

              {/* Warning */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.15)' }}>
                <AlertCircle size={16} style={{ color: '#ffd700', flexShrink: 0, marginTop: 1 }} />
                <p className="text-xs" style={{ color: 'rgba(255,215,0,0.7)' }}>
                  <strong style={{ color: '#ffd700' }}>Import once only.</strong> Clicking multiple times creates duplicate guests.
                  Check your Guests page first if you have already imported some contacts.
                </p>
              </motion.div>

              {/* Preview toggle */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="section-label">PREVIEW</div>
                  <button onClick={() => setPreview(!preview)} className="btn-neon text-xs py-1.5 px-3">
                    {preview ? 'Hide' : 'Show first 10'}
                  </button>
                </div>
                {preview && (
                  <div className="space-y-1.5">
                    {guestsToImport.slice(0, 10).map((g, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: 'rgba(0,245,255,0.08)', color: '#00f5ff' }}>
                          {g.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">{g.name}</p>
                          <p className="text-[10px]" style={{ color: 'rgba(230,237,243,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>
                            {g.phone} {g.group_name && `· ${g.group_name}`}
                          </p>
                        </div>
                        {g.email && <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,245,255,0.1)', color: '#00f5ff', border: '1px solid rgba(0,245,255,0.2)' }}>EMAIL</span>}
                        <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,215,0,0.1)', color: '#ffd700', border: '1px solid rgba(255,215,0,0.2)' }}>SMS</span>
                      </div>
                    ))}
                    {guestsToImport.length > 10 && <p className="text-xs text-center pt-1" style={{ color: 'rgba(230,237,243,0.3)' }}>...and {guestsToImport.length - 10} more</p>}
                  </div>
                )}
              </motion.div>

              {/* Import button */}
              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleImport} disabled={importing || guestsToImport.length === 0}
                className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3"
                style={{
                  background: importing || guestsToImport.length === 0 ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #00c8ff, #00ffc8)',
                  color: importing || guestsToImport.length === 0 ? 'rgba(255,255,255,0.3)' : '#010409',
                  fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.1em',
                  cursor: importing || guestsToImport.length === 0 ? 'not-allowed' : 'pointer',
                }}>
                {importing
                  ? <><Loader2 size={16} className="animate-spin" /> IMPORTING {guestsToImport.length} GUESTS...</>
                  : <><Upload size={16} /> IMPORT {guestsToImport.length} GUESTS NOW</>
                }
              </motion.button>
            </>
          )}
        </div>
      </div>
    </>
  )
}