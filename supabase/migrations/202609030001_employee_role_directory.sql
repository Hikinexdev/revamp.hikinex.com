-- Active employee role directory imported from the supplied Talent Director PDF.
-- Portal Admin is deliberately excluded: the source identifies departments and managers,
-- but it does not authorize system-administrator access.

create or replace function public.normalize_employee_directory_name(value text)
returns text
language sql
immutable
parallel safe
as $$
  select lower(regexp_replace(regexp_replace(trim(coalesce(value, '')), '\s+-\s+h!kinex\.?$', '', 'i'), '\s+', ' ', 'g'));
$$;

create table if not exists public.employee_role_directory (
  match_key text primary key,
  full_name text not null,
  department text,
  job_title text,
  operations_manager text,
  portal_role text not null check (portal_role in ('employee', 'manager')),
  source_file text not null,
  updated_at timestamptz not null default now()
);

alter table public.employee_role_directory enable row level security;
revoke all on public.employee_role_directory from anon, authenticated;

insert into public.employee_role_directory
  (match_key, full_name, department, job_title, operations_manager, portal_role, source_file)
values
  ('adelaine repollo', 'Adelaine Repollo', 'Talent Acquisition', 'Talent Acquisition Specialist', 'Listy Rose Larita', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('ahmad naweed payman', 'Ahmad Naweed Payman', 'Recruiting', 'Executive Recruiter', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('aileen leana de los santos jimena', 'Aileen Leana De Los Santos Jimena', 'Recruiting', 'Executive Recruiter', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('aileen mae pecson bate', 'Aileen Mae Pecson Bate', 'Recruiting', 'Executive Recruiter', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('alexandra michelle padilla blanco', 'Alexandra Michelle Padilla Blanco', 'Talent Acquisition', 'Talent Acquisition Specialist', 'Riza Ashley Cortes Laguda', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('aliyah gray verde gebela', 'Aliyah Gray Verde Gebela', 'Talent Acquisition', 'Talent Acquisition Specialist', 'Listy Rose Larita', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('alliana gabriel esguerra hernandez', 'Alliana Gabriel Esguerra Hernandez', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('alyssa carla narvas catoy', 'Alyssa Carla Narvas Catoy', 'Management', 'Recruiting Operations Manager', 'Riza Ashley Cortes Laguda', 'manager', 'Talent Director - Active Employess.xlsx.pdf'),
  ('ana vaz', 'Ana Vaz', 'Virtual Assistant', 'Virtual Assistant', 'Mira Libiano Girasol', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('ana cecília hordones', 'Ana Cecília Hordones', 'Training - Recruiting', 'Executive Recruiter', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('andrea gale mintar tayaba', 'Andrea Gale Mintar Tayaba', 'Workforce', 'eDiscovery Associate Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('angel mae baldos montilde', 'Angel Mae Baldos Montilde', 'Recruiting', 'Executive Recruiter', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('angelica macalagay abigan', 'Angelica Macalagay Abigan', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('angeline mae de guzman peralta', 'Angeline Mae De Guzman Peralta', 'Workforce', 'eDiscovery Associate Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('angie melisa duque valero', 'Angie Melisa Duque Valero', 'Recruiting - Sourcer', 'Talent Acquisition Specialist', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('anjali katrodia', 'Anjali Katrodia', 'Management', 'Operations - Associate Director', 'Andy Jimenez', 'manager', 'Talent Director - Active Employess.xlsx.pdf'),
  ('anne geline mercado cunanan', 'Anne Geline Mercado Cunanan', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('anne lereine zapanta vista', 'Anne Lereine Zapanta Vista', 'Workforce', 'eDiscovery Quality and Training Manager', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('antonia bertoli miraglia', 'Antonia Bertoli Miraglia', 'Virtual Assistant', 'Project Manager', 'Chardanne Marie Lorezo Magno', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('arpan herbert', 'Arpan Herbert', 'Training Team', 'Training Admin', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('arpita nayak', 'Arpita Nayak', 'Recruiting', 'Executive Recruiter', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('arziel lopez zamora', 'Arziel Lopez Zamora', 'Recruiting', 'Executive Recruiter', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('ashok kumar', 'Ashok Kumar', 'Marketing', 'Marketing Specialist', 'Shreya Shrivastava', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('asylla marie babera naraga', 'Asylla Marie Babera Naraga', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('augusto celli', 'Augusto Celli', 'Accounting', 'Bookkeeper', 'Laura Tsang', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('ayezza magsino zaragoza', 'Ayezza Magsino Zaragoza', 'Sales Assistant', 'Sales Assistant', 'Anjali Katrodia', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('aysha mohmaad rafique ansari', 'Aysha Mohmaad Rafique Ansari', 'Recruiting', 'Executive Recruiter', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('bea patricia espinosa valdez', 'Bea Patricia Espinosa Valdez', 'Workforce', 'Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('beatriz andrade', 'Beatriz Andrade', 'Recruiting', 'Executive Recruiter', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('beatriz carbajo silva', 'Beatriz Carbajo Silva', 'Training - Recruiting Assistant', 'Recruiter Assistant', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('beatriz rosa', 'Beatriz Rosa', 'Sales', 'Sales Assistant', 'Andy Jimenez', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('beverlyn duran dramatcho', 'Beverlyn Duran Dramatcho', 'Sales', 'Sales Account Executive', 'Julia Gonçalves', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('bianca santos saldanha de aquino', 'Bianca Santos Saldanha de Aquino', 'Recruiting', 'Executive Recruiter', 'Riza Ashley Cortes Laguda', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('brian tanghal guansing', 'Brian Tanghal Guansing', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('bruna carrijo', 'Bruna Carrijo', 'Sales', 'Sales Account Executive', 'Victor Skinner', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('camille baluyut dumanew', 'Camille Baluyut Dumanew', 'Workforce', 'Senior Project Manager', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('camille palmero kiunisala', 'Camille Palmero Kiunisala', 'Recruiting Assistant', 'Recruiting Assistant', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('caroline luz', 'Caroline Luz', 'Sales', 'Sales Assistant', 'Andy Jimenez', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('chardanne marie lorezo magno', 'Chardanne Marie Lorezo Magno', 'Management', 'Client Engagement Manager', 'Andy Jimenez', 'manager', 'Talent Director - Active Employess.xlsx.pdf'),
  ('chashmyr ignacio', 'Chashmyr Ignacio', 'Recruiting', 'Executive Recruiter', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('christin joy herrera agravante', 'Christin Joy Herrera Agravante', 'Recruiting', 'Executive Recruiter', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('christine faith pinpin villaluz', 'Christine Faith Pinpin Villaluz', 'Recruiting Assistant', 'Recruiting Assistant', 'Riza Ashley Cortes Laguda', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('claire galvez caingcoy', 'Claire Galvez Caingcoy', 'Recruiting', 'Executive Recruiter', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('claire mercado buenaflor', 'Claire Mercado Buenaflor', 'Accounting', 'Accounting Specialist', 'Laura Tsang', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('collin grace hondrada yanson', 'Collin Grace Hondrada Yanson', 'Virtual Assistant', 'Virtual Assistant', 'Riya Dewangan', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('crista mhir valerio reyes', 'Crista Mhir Valerio Reyes', 'Virtual Assistant', 'Executive Assistant', 'Mira Libiano Girasol', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('cristal medina', 'Cristal Medina', 'Recruiting', 'Executive Recruiter', 'Riza Ashley Cortes Laguda', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('cristine mae mailo galanza', 'Cristine Mae Mailo Galanza', 'Workforce', 'Quality and Training Manager', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('cristobal lavarello falco', 'Cristobal Lavarello Falco', 'Training - Sales', 'Sales Account Executive', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('dahpny dulnuan gragasin', 'Dahpny Dulnuan Gragasin', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('dainne mae lao aspuria', 'Dainne Mae Lao Aspuria', 'Recruiting Assistant', 'Recruiting Assistant', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('daniel sanguino', 'Daniel Sanguino', 'Sales', 'Sales Account Executive', 'Julia Gonçalves', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('daniella luisa carlos gonzales', 'Daniella Luisa Carlos Gonzales', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('danielle louise javier villagracia', 'Danielle Louise Javier Villagracia', 'Workforce', 'eDiscovery Project Manager', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('david bastos', 'David Bastos', 'Recruiting', 'Executive Recruiter', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('debarpan halder', 'Debarpan Halder', 'Operations', 'Operations Associate', 'Andy Jimenez', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('dexter royeras amata', 'Dexter Royeras Amata', 'Workforce', 'eDiscovery - Project Manager', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('diana dawn sailo einosas', 'Diana Dawn Sailo Einosas', 'Training - Recruiting Assistant', 'Recruiting Assistant', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('diana louise mortel mayuga', 'Diana Louise Mortel Mayuga', 'Management', 'Recruiting Operations Manager', 'Riza Ashley Cortes Laguda', 'manager', 'Talent Director - Active Employess.xlsx.pdf'),
  ('dianne lei denora porras', 'Dianne Lei Denora Porras', 'Training - Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('diego raphael mortel mayuga', 'Diego Raphael Mortel Mayuga', 'Training - Virtual Assistant', 'Virtual Assistant', 'Mira Libiano Girasol', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('duda guimarães', 'Duda Guimarães', 'Recruiting', 'Executive Recruiter', 'Riza Ashley Cortes Laguda', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('eddilyn mae orcine navarro', 'Eddilyn Mae Orcine Navarro', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('eduardo barreto', 'Eduardo Barreto', 'Sales Assistant', 'Sales Assistant', 'Anjali Katrodia', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('edward enrique ortiz ortega', 'Edward Enrique Ortiz Ortega', 'Sales Assistant', 'Sales Assistant', 'Julia Gonçalves', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('elaiza rose maisog anobling', 'Elaiza Rose Maisog Anobling', 'Recruiting', 'Executive Recruiter', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('elgin collin sy nuñez', 'Elgin Collin Sy Nuñez', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('elian santos', 'Elian Santos', 'Sales', 'Sales Account Executive', 'Julia Gonçalves', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('elizabeth monzon', 'Elizabeth Monzon', 'Recruiting', 'Executive Recruiter', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('erick mauricio carvajal calderon', 'Erick Mauricio Carvajal Calderon', 'Training - Sales', 'Enterprise Account Executive', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('erin carranza aguja', 'Erin Carranza Aguja', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('eunice anne loria medrano', 'Eunice Anne Loria Medrano', 'Recruiting', 'Recruiting Team Lead', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('ezekiel john sanchez galliguez', 'Ezekiel John Sanchez Galliguez', 'Workforce', 'E-Discovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('fahad reyaz dar', 'Fahad Reyaz Dar', 'Training - Recruiting Assistant', 'Recruiting Assistant', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('fatima glorey espinosa valdez', 'Fatima Glorey Espinosa Valdez', 'Workforce', 'eDiscovery Senior Project Manager', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('felipe dihl fontoura', 'Felipe Dihl Fontoura', 'Training Team', 'Sales Coach', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('flavio nunes', 'Flavio Nunes', 'Sales', 'Sales Account Executive', 'Patricia Madeleine Sifuentes', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('florence joy villaseñor magbanua', 'Florence Joy Villaseñor Magbanua', 'Admin', 'e-Discovery Admin Assistant', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('gabriela pauli', 'Gabriela Pauli', 'Sales', 'Sales Assistant', 'Victor Skinner', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('giaztyne lopez dumalaon', 'Giaztyne Lopez Dumalaon', 'Recruiting', 'Recruiting Assistant', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('gilbert laconse sanidad', 'Gilbert Laconse Sanidad', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('giovanna ferrari', 'Giovanna Ferrari', 'Sales', 'Sales Account Executive', 'Julia Gonçalves', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('giovanna gomes', 'Giovanna Gomes', 'Training - Recruiting Assistant', 'Recruiter Assistant', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('glaiza joy caranguian dela cruz', 'Glaiza Joy Caranguian Dela Cruz', 'Training - Workforce', 'eDiscovery Project Manager', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('glenn dugayo bugaay', 'Glenn Dugayo Bugaay', 'Recruiting', 'Executive Recruiter', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('gyann albiso valdepeña', 'Gyann Albiso Valdepeña', 'Virtual Assistant', 'Executive Assistant', 'Anjali Katrodia', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('gynisa jaruda villanueva', 'Gynisa Jaruda Villanueva', 'Management', 'Director - HR', 'Riza Ashley Cortes Laguda', 'manager', 'Talent Director - Active Employess.xlsx.pdf'),
  ('hadeya surian riga', 'Hadeya Surian Riga', 'Training - Workforce', 'Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('hanna jane atinto ardales', 'Hanna Jane Atinto Ardales', 'Recruiting', 'Executive Recruiter', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('hannah casupang carandang', 'Hannah Casupang Carandang', 'Training - Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('hazel mae san juan delos santos', 'Hazel Mae San Juan Delos Santos', 'Recruiting Assistant', 'Recruiting Assistant', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('helena queiroz', 'Helena Queiroz', 'Talent Acquisition', 'Operations Associate', 'Listy Rose Larita', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('himesh kumar', 'Himesh Kumar', 'Virtual Assistant', 'Graphic Designer', 'Chardanne Marie Lorezo Magno', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('hugo iram bautista cardona', 'Hugo Iram Bautista Cardona', 'CX', 'Technical CS Representative', 'Chardanne Marie Lorezo Magno', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('ignacio suarez', 'Ignacio Suarez', 'Sales Operations', 'Sales Director', 'Victor Skinner', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('ingra vital', 'Ingra Vital', 'Sales', 'Sales Account Executive', 'Anjali Katrodia', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('isabelly teixeira', 'Isabelly Teixeira', 'Training - Virtual Assistant', 'Virtual Assistant', 'Mira Libiano Girasol', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('isadora borges', 'Isadora Borges', 'Recruiting', 'Executive Recruiter', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('ishita choudhary', 'Ishita Choudhary', 'Recruiting', 'Executive Recruiter', 'Riza Ashley Cortes Laguda', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('italo trancolin', 'Italo Trancolin', 'Sales', 'Sales Account Executive', 'Victor Skinner', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('ivan renzl ii josef timbas', 'Ivan Renzl II Josef Timbas', 'Workforce', 'Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('iveelyn secuban', 'Iveelyn Secuban', 'Workforce', 'Senior Project Manager', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('ivy jean calunod damaulao', 'Ivy Jean Calunod Damaulao', 'Recruiting', 'Executive Recruiter', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('jackilyn igle', 'Jackilyn Igle', 'Recruiting', 'Virtual Assistant - Recruiter', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('jacqueline baylosis jimenez', 'Jacqueline Baylosis Jimenez', 'Recruiting - Sourcer', 'Recruiting Assistant', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('jaezelle anne fabian bernabe', 'Jaezelle Anne Fabian Bernabe', 'Management', 'Sr. Engagement Manager', 'Andy Jimenez', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('jahzeel fortuna guiral', 'Jahzeel Fortuna Guiral', 'Recruiting', 'Executive Recruiter', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('janela dela cruz geronimo', 'Janela Dela Cruz Geronimo', 'Recruiting', 'Executive Recruiter', 'Riza Ashley Cortes Laguda', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('jannelle hazel barbero cuña', 'Jannelle Hazel Barbero Cuña', 'Virtual Assistant', 'Virtual Assistant', 'Mira Libiano Girasol', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('jasmin galicia co', 'Jasmin Galicia Co', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('jearcy kim atienza de villa', 'Jearcy Kim Atienza De Villa', 'Marketing', 'Marketing Assistant', 'Andy Jimenez', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('jeleene krizia sejera ciceron', 'Jeleene Krizia Sejera Ciceron', 'Training Team', 'Training Director', 'Andy Jimenez', 'manager', 'Talent Director - Active Employess.xlsx.pdf'),
  ('jerome leonard guanzon almario', 'Jerome Leonard Guanzon Almario', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('jerrylou barco pantaleon', 'Jerrylou Barco Pantaleon', 'Training - Virtual Assistant', 'Virtual Assistant', 'Mira Libiano Girasol', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('jhae tinoy escamillan', 'Jhae Tinoy Escamillan', 'Virtual Assistant', 'Virtual Assistant', 'Mira Libiano Girasol', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('jhezalyn roquin tacalan', 'Jhezalyn Roquin Tacalan', 'Virtual Assistant', 'Charisma Admin', 'Gynisa Jaruda Villanueva', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('jian aldrich lopez soriano', 'Jian Aldrich Lopez Soriano', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('jivi may morales iñigo', 'Jivi May Morales Iñigo', 'Management', 'Associate Director - VA', 'Andy Jimenez', 'manager', 'Talent Director - Active Employess.xlsx.pdf'),
  ('joanna schwendler', 'Joanna Schwendler', 'Sales', 'Engagement Manager', 'Andy Jimenez', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('joão felipe paiva', 'João Felipe Paiva', 'Sales', 'Sales Account Executive', 'Victor Skinner', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('jocelyn arceo reyes', 'Jocelyn Arceo Reyes', 'Talent Acquisition', 'Executive Assistant', 'Listy Rose Larita', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('johann paulo perez capinpin', 'Johann Paulo Perez Capinpin', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('johanna anque fontanosa', 'Johanna Anque Fontanosa', 'Recruiting', 'Executive Recruiter', 'Riza Ashley Cortes Laguda', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('john kenneth semeniano principe', 'John Kenneth Semeniano Principe', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('jon aniel solitario arquisola', 'Jon Aniel Solitario Arquisola', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('josemari lorenzo huyo-a santos', 'Josemari Lorenzo Huyo-a Santos', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('julia dutra', 'Julia Dutra', 'Sales Assistant', 'Sales Assistant', 'Julia Gonçalves', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('julia gonçalves', 'Julia Gonçalves', 'Sales Operations', 'Associate Business Manager', 'Victor Skinner', 'manager', 'Talent Director - Active Employess.xlsx.pdf'),
  ('juliana alves isaacs', 'Juliana Alves Isaacs', 'Training - Virtual Assistant', 'Virtual Assistant', 'Mira Libiano Girasol', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('juliana scheleder', 'Juliana Scheleder', 'Sales Assistant', 'Sales Assistant', 'Victor Skinner', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('julian marcos stocco', 'Julian Marcos Stocco', 'Training - Sales', 'Sales Account Executive', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('justin ynah sarsagat barredo', 'Justin Ynah Sarsagat Barredo', 'Recruiting', 'Executive Recruiter', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('justine joyce samin', 'Justine Joyce Samin', 'Sales Assistant', 'Sales Assistant', 'Gynisa Jaruda Villanueva', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('kai bradley', 'Kai Bradley', 'Training - Sales Assistant', 'Sales Assistant', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('karen corteza camu', 'Karen Corteza Camu', 'Virtual Assistant', 'Virtual Assistant', 'Mira Libiano Girasol', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('karen joi salcedo rengais', 'Karen Joi Salcedo Rengais', 'Recruiting', 'Executive Recruiter', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('karryle ann alvarez ariola', 'Karryle Ann Alvarez Ariola', 'Talent Acquisition', 'Talent Acquisition Specialist', 'Listy Rose Larita', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('katharina thiede', 'Katharina Thiede', 'Training - Sales Assistant', 'Sales Assistant', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('katheen bacares bathan', 'Katheen Bacares Bathan', 'Recruiting - Sourcer', 'Recruiting Assistant', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('katherine batula abdon', 'Katherine Batula Abdon', 'Virtual Assistant', 'Virtual Assistant', 'Chardanne Marie Lorezo Magno', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('katrina louise trillana guevara', 'Katrina Louise Trillana Guevara', 'Training - Workforce', 'E-discovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('keia jade damaso', 'Keia Jade Damaso', 'Accounting', 'Accounting Specialist', 'Riza Ashley Cortes Laguda', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('kennia montserrat hernandez hernandez', 'Kennia Montserrat Hernandez Hernandez', 'Recruiting', 'Executive Recruiter', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('kevin reyes alarcon', 'Kevin Reyes Alarcon', 'Workforce', 'Senior Project Manager', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('kevin rosler', 'Kevin Rosler', 'Recruiting', 'Executive Recruiter', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('kim abigail rogado david', 'Kim Abigail Rogado David', 'Virtual Assistant', 'Virtual Assistant', 'Mira Libiano Girasol', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('kristine mae abalos villanueva', 'Kristine Mae Abalos Villanueva', 'Virtual Assistant', 'Virtual Assistant', 'Chardanne Marie Lorezo Magno', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('kristine michelle ola bulaon', 'Kristine Michelle Ola Bulaon', 'Human Resource', 'HR Specialist', 'Gynisa Jaruda Villanueva', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('kyla mallari virgino', 'Kyla Mallari Virgino', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('kyla marie sinosa himpit', 'Kyla Marie Sinosa Himpit', 'Recruiting Assistant', 'Recruiting Assistant', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('larissa vieira', 'Larissa Vieira', 'Sales', 'Sales Account Executive', 'Patricia Madeleine Sifuentes', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('laura schwartz', 'Laura Schwartz', 'Marketing', 'Associate Creative Director', 'Andy Jimenez', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('lawrence rivera tuazon', 'Lawrence Rivera Tuazon', 'Workforce', 'E-Discovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('lee arnie mendoza bernardino', 'Lee Arnie Mendoza Bernardino', 'Recruiting', 'Executive Recruiter', 'Riza Ashley Cortes Laguda', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('lenneth erfe fernandez', 'Lenneth Erfe Fernandez', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('leslie elizabeth vega', 'Leslie Elizabeth Vega', 'Recruiting', 'Executive Recruiter', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('liezl ann aznar ilagan', 'Liezl Ann Aznar Ilagan', 'Workforce', 'Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('listy rose larita', 'Listy Rose Larita', 'Management', 'Talent Acquisition Director', 'Andy Jimenez', 'manager', 'Talent Director - Active Employess.xlsx.pdf'),
  ('lorenzo brum', 'Lorenzo Brum', 'Sales Assistant', 'Sales Assistant', 'Julia Gonçalves', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('lorenzo cabrera lopez jr.', 'Lorenzo Cabrera Lopez Jr.', 'Workforce', 'eDiscovery - Project Manager', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('lourdes grace jimena bacong', 'Lourdes Grace Jimena Bacong', 'Recruiting', 'Executive Recruiter', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('lucky cerniaz ecarma', 'Lucky Cerniaz Ecarma', 'Recruiting', 'Executive Recruiter', 'Riza Ashley Cortes Laguda', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('lykha phrill guillen', 'Lykha Phrill Guillen', 'IT', 'Senior HR Admin Coordinator', 'Riya Dewangan', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('ma. danielle michaela puyat cruz', 'Ma. Danielle Michaela Puyat Cruz', 'Workforce', 'E-Discovery Workforce - Director', 'Andy Jimenez', 'manager', 'Talent Director - Active Employess.xlsx.pdf'),
  ('ma. lezlyn salutin simbulan', 'Ma. Lezlyn Salutin Simbulan', 'Recruiting', 'Executive Recruiter', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('ma. luisa lee soledad reyes', 'Ma. Luisa Lee Soledad Reyes', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('ma. rose anne agrava gulinao', 'Ma. Rose Anne Agrava Gulinao', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('ma. catherine joy darang beltran', 'Ma. Catherine Joy Darang Beltran', 'Talent Acquisition', 'Talent Acquisition', 'Listy Rose Larita', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('manuel alfonso pedraza lozano', 'Manuel Alfonso Pedraza Lozano', 'Training - Recruiting', 'Executive Recruiter', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('marcherann catangui phong', 'Marcherann Catangui Phong', 'Virtual Assistant', 'Virtual Assistant', 'Mira Libiano Girasol', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('marco tulio montes', 'Marco Tulio Montes', 'Virtual Assistant', 'Virtual Assistant', 'Chardanne Marie Lorezo Magno', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('marcos paulo vieira', 'Marcos Paulo Vieira', 'Sales', 'Sales Assistant', 'Victor Skinner', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('maria camille timbal golosinda', 'Maria Camille Timbal Golosinda', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('maria ericka diama ganiban', 'Maria Ericka Diama Ganiban', 'IT', 'Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('maria fernanda ávila', 'Maria Fernanda Ávila', 'Training - Recruiting Assistant', 'Recruiting Assistant', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('maria luisa tonelli', 'Maria Luisa Tonelli', 'Recruiting', 'Executive Recruiter', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('maria sol almaden cajefe', 'Maria Sol Almaden Cajefe', 'Recruiting', 'Executive Recruiter', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('maria vitoria simonetti', 'Maria Vitoria Simonetti', 'Recruiting', 'Sales Account Executive', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('mariana cruz', 'Mariana Cruz', 'DevOps', 'AI Coding Specialist', 'Andy Jimenez', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('mariana fernandes', 'Mariana Fernandes', 'Recruiting Assistant', 'Recruiting Assistant', 'Riza Ashley Cortes Laguda', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('mariana ribeiro', 'Mariana Ribeiro', 'Recruiting Assistant', 'Recruiter Assistant', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('mariane regala pagunsan', 'Mariane Regala Pagunsan', 'Recruiting Assistant', 'Recruiting Assistant', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('marjorie fuentes jaramilla', 'Marjorie Fuentes Jaramilla', 'Human Resource', 'Human Resource Specialist', 'Gynisa Jaruda Villanueva', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('mark dominic marcojos arong', 'Mark Dominic Marcojos Arong', 'Workforce', 'Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('marnie joy dalabajan dela gente', 'Marnie Joy Dalabajan Dela Gente', 'Virtual Assistant', 'Virtual Assistant', 'Mira Libiano Girasol', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('mary joy olaes ferreras', 'Mary Joy Olaes Ferreras', 'Recruiting', 'Executive Recruiter', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('mary rose de la rosa cabanela', 'Mary Rose De la Rosa Cabanela', 'Recruiting', 'Executive Recruiter', 'Riza Ashley Cortes Laguda', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('maryjane angusto sebuc', 'Maryjane Angusto Sebuc', 'Virtual Assistant', 'Virtual Assistant', 'Chardanne Marie Lorezo Magno', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('marynelle zapanta centino', 'Marynelle Zapanta Centino', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('maureen ericka francisco albindo', 'Maureen Ericka Francisco Albindo', 'Recruiting', 'Executive Recruiter', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('mayara reis', 'Mayara Reis', 'Virtual Assistant', 'Virtual Assistant', 'Mira Libiano Girasol', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('megara lopez', 'Megara Lopez', 'Recruiting - Sourcer', 'Talent Acquisition Specialist', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('melanie weimberg', 'Melanie Weimberg', 'Training - Recruiting', 'Executive Recruiter', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('michael pranz batino calderon', 'Michael Pranz Batino Calderon', 'Workforce', 'eDiscovery Project Manager', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('michelle polinar ilajas', 'Michelle Polinar Ilajas', 'Virtual Assistant', 'Virtual Assistant', 'Mira Libiano Girasol', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('mira libiano girasol', 'Mira Libiano Girasol', 'Virtual Assistant', 'VA Manager', 'Riza Ashley Cortes Laguda', 'manager', 'Talent Director - Active Employess.xlsx.pdf'),
  ('misbah mubeen shah', 'Misbah Mubeen Shah', 'Talent Acquisition', 'Talent Acquisition Specialist', 'Listy Rose Larita', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('monica abainza duran', 'Monica Abainza Duran', 'Recruiting Assistant', 'Recruiting Assistant', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('natalia tavares', 'Natalia Tavares', 'Virtual Assistant', 'Virtual Assistant', 'Riza Ashley Cortes Laguda', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('nicole mangubat elauria', 'Nicole Mangubat Elauria', 'Virtual Assistant', 'Virtual Assistant', 'Chardanne Marie Lorezo Magno', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('nicolle adriana cardenas', 'Nicolle Adriana Cardenas', 'Recruiting', 'Executive Recruiter', 'Riza Ashley Cortes Laguda', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('nirmiti ramesh tamore', 'Nirmiti Ramesh Tamore', 'IT', 'Web Developer', 'Jivi May Morales Iñigo', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('oscar mauricio montenegro', 'Oscar Mauricio Montenegro', 'Virtual Assistant', 'Virtual Assistant', 'Chardanne Marie Lorezo Magno', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('patricia journe aquino cabiscuelas', 'Patricia Journe Aquino Cabiscuelas', 'Recruiting', 'Recruiting Assistant', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('patricia madeleine sifuentes', 'Patricia Madeleine Sifuentes', 'Training - Sales', 'Sales Account Executive', 'Jeleene Krizia Sejera Ciceron', 'manager', 'Talent Director - Active Employess.xlsx.pdf'),
  ('patrick chad aznar roque', 'Patrick Chad Aznar Roque', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('patrick kyle durano jardinel', 'Patrick Kyle Durano Jardinel', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('pedro hugo neto', 'Pedro Hugo Neto', 'Sales', 'Sales Assistant', 'Victor Skinner', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('peter edison orlina roldan', 'Peter Edison Orlina Roldan', 'Workforce', 'Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('peter iii rama malajacan', 'Peter III Rama Malajacan', 'Training - Workforce', 'E-discovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('pietra perez', 'Pietra Perez', 'Training Team', 'Voice and Accent Trainer', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('princess angel lucob hoylar', 'Princess Angel Lucob Hoylar', 'Virtual Assistant', 'Virtual Assistant', 'Chardanne Marie Lorezo Magno', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('princess jome beatryxz boyon burce', 'Princess Jome Beatryxz Boyon Burce', 'Talent Acquisition', 'Talent Acquisition Specialist', 'Listy Rose Larita', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('rafael cervantes reyes', 'Rafael Cervantes Reyes', 'Recruiting', 'Executive Recruiter', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('reece adrian cortes laguda', 'Reece Adrian Cortes Laguda', 'Workforce', 'eDiscovery Associate Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('regina rivera sultan', 'Regina Rivera Sultan', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('remphanielle valderama', 'Remphanielle Valderama', 'Sales', 'Sales Account Executive', 'Julia Gonçalves', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('rey arquio deopante', 'Rey Arquio Deopante', 'Workforce', 'Workforce Admin', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('rhaysa pereira', 'Rhaysa Pereira', 'Recruiting', 'Executive Recruiter', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('rian dale soriano viquiera', 'Rian Dale Soriano Viquiera', 'Recruiting', 'Executive Recruiter', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('richard louie campos nuguid', 'Richard Louie Campos Nuguid', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('riya dewangan', 'Riya Dewangan', 'Operations', 'Associate Director', 'Anjali Katrodia', 'manager', 'Talent Director - Active Employess.xlsx.pdf'),
  ('riza ashley cortes laguda', 'Riza Ashley Cortes Laguda', 'Management', 'Chief of Staff', 'Andy Jimenez', 'manager', 'Talent Director - Active Employess.xlsx.pdf'),
  ('rose shukla', 'Rose Shukla', 'IT', 'Software Engineer', 'Andy Jimenez', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('roy abenales fuentes', 'Roy Abenales Fuentes', 'Facilities', 'Admin and Maintenance Personnel', 'Gynisa Jaruda Villanueva', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('rubinah joy baylon tajonera', 'Rubinah Joy Baylon Tajonera', 'Human Resource', 'HR Specialist', 'Gynisa Jaruda Villanueva', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('ruther publico aranas', 'Ruther Publico Aranas', 'Recruiting', 'Executive Recruiter', 'Riza Ashley Cortes Laguda', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('sagar bag', 'Sagar Bag', 'Accounting', 'Accounting Specialist', 'Riza Ashley Cortes Laguda', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('sanya srivastava', 'Sanya Srivastava', 'Marketing', 'Multimedia Designer', 'Andy Jimenez', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('saqib mohammad matoo', 'Saqib Mohammad Matoo', 'Training - Recruiting', 'Executive Recruiter', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('sara carneiro', 'Sara Carneiro', 'Admin - Internal', 'Operations Associate for Virtual Assistant', 'Mira Libiano Girasol', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('seth amiel alviar cruzat', 'Seth Amiel Alviar Cruzat', 'Training - Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('shaine mary laron yaneza', 'Shaine Mary Laron Yaneza', 'Workforce', 'E-Discovery Service - Account Director', 'Andy Jimenez', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('shaurya vardhan parmar', 'Shaurya Vardhan Parmar', 'Recruiting', 'Executive Recruiter', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('sheanne ann robes pino', 'Sheanne Ann Robes Pino', 'Recruiting', 'Executive Recruiter', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('sheryl lynn blah soon', 'Sheryl lynn Blah Soon', 'Recruiting', 'Executive Recruiter', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('shiena mary tobias laron', 'Shiena Mary Tobias Laron', 'Workforce', 'eDiscovery Data Analyst', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('shiezel wendy mae tinoy escamillan', 'Shiezel Wendy Mae Tinoy Escamillan', 'Virtual Assistant', 'Virtual Assistant', 'Mira Libiano Girasol', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('shreya khare shrivastava', 'Shreya Khare Shrivastava', 'Marketing', 'Internal Marketing PM and Tech Specialist', 'Andy Jimenez', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('sophia scudder', 'Sophia Scudder', 'Training - Recruiting', 'Executive Recruiter', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('srishti r rao', 'Srishti R Rao', 'Recruiting', 'Executive Recruiter', 'Riza Ashley Cortes Laguda', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('srushti surve', 'Srushti Surve', 'Admin - Internal', 'Executive Assistant', 'Anjali Katrodia', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('sukanya tamuly', 'Sukanya Tamuly', 'Virtual Assistant', 'Data Mining Specialist', 'Mira Libiano Girasol', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('sukhpreet kaur', 'Sukhpreet Kaur', 'Recruiting Assistant', 'Recruiting Assistant', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('tassia pavezi', 'Tassia Pavezi', 'Training - Sales', 'Sales Account Executive', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('thalita marques', 'Thalita Marques', 'Recruiting', 'Executive Recruiter', 'Riza Ashley Cortes Laguda', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('thavani teles', 'Thavani Teles', 'Training - Recruiting', 'Executive Recruiter', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('thayane ramos', 'Thayane Ramos', 'Sales', 'Sales Account Executive', 'Julia Gonçalves', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('trisha anne lozada paniergo', 'Trisha Anne Lozada Paniergo', 'Recruiting Assistant', 'Recruiting Assistant', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('valeria gonzalez cubillos', 'Valeria Gonzalez Cubillos', 'CX', 'Order Support Representative', 'Chardanne Marie Lorezo Magno', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('vea patricia corciega tepace-macatangay', 'Vea Patricia Corciega Tepace-Macatangay', 'Recruiting', 'Executive Recruiter', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('vera opeña elec', 'Vera Opeña Elec', 'Virtual Assistant', 'Virtual Assistant', 'Chardanne Marie Lorezo Magno', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('victor skinner', 'Victor Skinner', 'Sales Operations', 'Sales Operations Associate Director', 'Andy Jimenez', 'manager', 'Talent Director - Active Employess.xlsx.pdf'),
  ('xavier seth del rosario ambrocio', 'Xavier Seth Del Rosario Ambrocio', 'Workforce', 'eDiscovery Associate Project Manager', 'Ma. Danielle Michaela Puyat Cruz', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('yash himmat mohite', 'Yash Himmat Mohite', 'Training - Recruiting Assistant', 'Recruiting Assistant', 'Jeleene Krizia Sejera Ciceron', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('yassin alderderi', 'Yassin Alderderi', 'Recruiting', 'Executive Recruiter', 'Alyssa Carla Narvas Catoy', 'employee', 'Talent Director - Active Employess.xlsx.pdf'),
  ('zyrah tacaca estacio', 'Zyrah Tacaca Estacio', 'Recruiting', 'Executive Recruiter', 'Diana Louise Mortel Mayuga', 'employee', 'Talent Director - Active Employess.xlsx.pdf')
on conflict (match_key) do update set
  full_name = excluded.full_name,
  department = excluded.department,
  job_title = excluded.job_title,
  operations_manager = excluded.operations_manager,
  portal_role = excluded.portal_role,
  source_file = excluded.source_file,
  updated_at = now();

-- Known Microsoft display-name variants are aliases, not duplicate employees.
create table if not exists public.employee_role_aliases (
  alias_match_key text primary key,
  directory_match_key text not null references public.employee_role_directory(match_key) on delete cascade
);

alter table public.employee_role_aliases enable row level security;
revoke all on public.employee_role_aliases from anon, authenticated;

insert into public.employee_role_aliases (alias_match_key, directory_match_key)
values
  (public.normalize_employee_directory_name('Jearcy Kim De Villa'), public.normalize_employee_directory_name('Jearcy Kim Atienza De Villa')),
  (public.normalize_employee_directory_name('Jivi May Iñigo'), public.normalize_employee_directory_name('Jivi May Morales Iñigo')),
  (public.normalize_employee_directory_name('Shreya Shrivastava'), public.normalize_employee_directory_name('Shreya Khare Shrivastava'))
on conflict (alias_match_key) do update set directory_match_key = excluded.directory_match_key;

-- Clean up rows produced by an earlier draft that stored aliases as employees.
delete from public.employee_role_directory d
using public.employee_role_aliases a
where d.match_key = a.alias_match_key
  and a.alias_match_key <> a.directory_match_key;

create or replace function public.sync_my_employee_role()
returns table(role text, display_name text, department text)
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  caller_id uuid := auth.uid();
  microsoft_name text;
  directory_record public.employee_role_directory%rowtype;
begin
  if caller_id is null then
    raise exception 'Authentication required';
  end if;

  select coalesce(
    nullif(identity_data->>'full_name', ''),
    nullif(identity_data->>'name', ''),
    nullif(identity_data->>'display_name', '')
  )
  into microsoft_name
  from auth.identities
  where user_id = caller_id and provider = 'azure'
  order by created_at desc
  limit 1;

  if microsoft_name is not null then
    select d.*
    into directory_record
    from public.employee_role_directory d
    where d.match_key = coalesce(
      (select a.directory_match_key
       from public.employee_role_aliases a
       where a.alias_match_key = public.normalize_employee_directory_name(microsoft_name)),
      public.normalize_employee_directory_name(microsoft_name)
    );

    if found then
      update public.profiles p
      set
        display_name = regexp_replace(trim(microsoft_name), '\s+-\s+H!KINEX\.?$', '', 'i'),
        department = coalesce(directory_record.department, p.department),
        role = case when p.role = 'admin' then 'admin' else directory_record.portal_role end,
        updated_at = now()
      where p.user_id = caller_id;
    end if;
  end if;

  return query
  select p.role, p.display_name, p.department
  from public.profiles p
  where p.user_id = caller_id;
end;
$$;

revoke all on function public.sync_my_employee_role() from public, anon;
grant execute on function public.sync_my_employee_role() to authenticated;

-- Apply the same trusted Microsoft-identity match to profiles that already exist.
with microsoft_identities as (
  select distinct on (i.user_id)
    i.user_id,
    coalesce(
      nullif(i.identity_data->>'full_name', ''),
      nullif(i.identity_data->>'name', ''),
      nullif(i.identity_data->>'display_name', '')
    ) as microsoft_name
  from auth.identities i
  where i.provider = 'azure'
  order by i.user_id, i.created_at desc
)
update public.profiles p
set
  display_name = regexp_replace(trim(mi.microsoft_name), '\s+-\s+H!KINEX\.?$', '', 'i'),
  department = coalesce(d.department, p.department),
  role = case when p.role = 'admin' then 'admin' else d.portal_role end,
  updated_at = now()
from microsoft_identities mi
left join public.employee_role_aliases a
  on a.alias_match_key = public.normalize_employee_directory_name(mi.microsoft_name)
join public.employee_role_directory d
  on d.match_key = coalesce(a.directory_match_key, public.normalize_employee_directory_name(mi.microsoft_name))
where p.user_id = mi.user_id;

