import { ChipSelector } from "@/components/profile/ChipSelector";
import { InputField } from "@/components/profile/InputField";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Tables } from "@/types/supabase_public";
import type { ChangeEvent } from "react";

// You may want to move these to a separate file
const INDUSTRIES = [
	"Tecnologia",
	"Salud",
	"Finanzas",
	"Educacion",
	"Comercio",
	"Manufactura",
	"Entretenimiento",
	"Agricultura",
	"Construccion",
	"Transporte",
	"Energia",
	"Telecomunicaciones",
	"Turismo",
	"Alimentacion",
	"Automotriz",
	"Moda y Textiles",
	"Logistica",
	"Medios de Comunicacion",
	"Arte y Cultura",
	"Deportes y Recreacion",
	"Consultoria",
	"Recursos Humanos",
	"Bienes Raices",
	"Servicios Publicos",
	"Seguridad y Defensa",
	"Productos Quimicos",
];

const BENEFITS = [
	// Salud y bienestar
	"Seguro de Salud",
	"Plan de Retiro",
	"Seguro Dental",
	"Seguro de Vida",
	"Cobertura de Salud Mental",
	"Acceso a Terapia",
	"Plan de Bienestar Emocional",
	"Subsidio para Membresia de Gimnasio",
	"Descuentos en Actividades Deportivas",
	"Evaluaciones Medicas Anuales",
	"Programas de Nutricion",

	// Trabajo remoto y flexibilidad
	"Trabajo Remoto",
	"Horarios Flexibles",
	"Subsidio para Equipo de Trabajo Remoto",
	"Pago de Internet o Servicios",
	"Dias Libres Extra",
	"Viernes Cortos",
	"Licencias Extendidas por Maternidad/Paternidad",
	"Dias de Voluntariado",
	"Permisos Personales Flexibles",

	// Desarrollo y capacitacion
	"Capacitacion Continua",
	"Programas de Mentoria",
	"Reembolso de Cursos",
	"Certificaciones Pagadas",
	"Conferencias y Seminarios Pagados",
	"Plan de Crecimiento Profesional",
	"Acceso a Bibliotecas Digitales",
	"Idiomas o Clases de Ingles",
	"Programas de Rotacion de Puestos",
	"Presupuesto para Educacion Continua",

	// Bonos e incentivos
	"Bonos",
	"Comisiones",
	"Bonos por Desempeno",
	"Bonos de Fin de Ano",
	"Acciones de la Empresa",
	"Plan de Participacion en Utilidades",
	"Premios por Antiguedad",
	"Incentivos por Referidos",
	"Descuentos en Productos o Servicios",
	"Recompensas por Innovacion",

	// Comodidades en la oficina
	"Snacks Gratis",
	"Comidas Subsididadas",
	"Descuentos en Restaurantes Cercanos",
	"Estacionamiento Gratuito",
	"Transporte Gratuito",
	"Espacios de Recreacion",
	"Oficinas Pet-Friendly",
	"Zona de Descanso",
	"Masajes en la Oficina",
	"Ambiente de Trabajo Colaborativo",
	"Cafeteria Interna",
	"Espacios para Lactancia",

	// Beneficios familiares
	"Guarderia",
	"Subsidio para Educacion Infantil",
	"Licencia Parental Extendida",
	"Beneficios para Dependientes",
	"Apoyo para Cuidado de Personas Mayores",
	"Regalos de Cumpleanos y Festivos",

	// Otros beneficios innovadores
	"Descuentos en Tecnologia",
	"Acceso a Plataformas de Streaming",
	"Viajes Corporativos",
	"Experiencias Exclusivas (eventos, conciertos)",
	"Creditos en Tiendas Asociadas",
	"Acceso a Servicios Legales",
	"Programas de Ahorro para Vacaciones",
	"Credito para Movilidad (bicicletas, scooters)",
	"Fondo de Emergencia para Empleados",
	"Bonos de Relocalizacion",
	"Viajes Internacionales por Capacitacion",
	"Clubes de Interes (lectura, juegos, deporte)",
	"Celebraciones de Cumpleanos",
	"Reconocimiento Publico por Logros",
	"Seguro de Viaje Corporativo",
	"Tarjetas de Regalo",
	"Reembolso de Gasto en Telefono Movil",
	"Descuentos en Ropa y Moda",
	"Acceso Anticipado a Nuevos Productos",
];

const COMPANY_SIZES = [
	"1-10",
	"11-50",
	"51-200",
	"201-500",
	"501-1000",
	"1000+",
];

interface CompanyProfileFormProps {
	profile: Tables<"company_profiles">;
	handleInputChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => void;
	handleAddItem: (item: string, itemType: "benefits") => void;
	handleRemoveItem: (item: string, itemType: "benefits") => void;
}

export function CompanyProfileForm({
	profile,
	handleInputChange,
	handleAddItem,
	handleRemoveItem,
}: CompanyProfileFormProps) {
	return (
		<>
			<InputField
				label="Nombre de la empresa"
				id="company_name"
				name="company_name"
				value={profile.company_name}
				onChange={handleInputChange}
				required
			/>
			<div className="space-y-2">
				<Label htmlFor="industry">Industria</Label>
				<Select
					name="industry"
					value={profile.industry || ""}
					onValueChange={(value) =>
						handleInputChange({
							target: { name: "industry", value },
						} as ChangeEvent<HTMLInputElement>)
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Selecciona la industria" />
					</SelectTrigger>
					<SelectContent>
						{INDUSTRIES.map((industry) => (
							<SelectItem key={industry} value={industry}>
								{industry}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="space-y-2">
				<Label htmlFor="company_size">Tamaño de la empresa</Label>
				<Select
					name="company_size"
					value={profile.company_size?.toString() || ""}
					onValueChange={(value) =>
						handleInputChange({
							target: { name: "companySize", value },
						} as ChangeEvent<HTMLInputElement>)
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Selecciona el tamaño de la empresa" />
					</SelectTrigger>
					<SelectContent>
						{COMPANY_SIZES.map((size) => (
							<SelectItem key={size} value={size}>
								{size}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="space-y-2">
				<Label htmlFor="description">Descripción</Label>
				<Textarea
					id="description"
					name="description"
					value={profile.description || ""}
					onChange={handleInputChange}
					required
				/>
			</div>
			<InputField
				label="Sitio web"
				id="website"
				name="website"
				value={profile.website || ""}
				onChange={handleInputChange}
				type="url"
				required
			/>
			<InputField
				label="Ubicación"
				id="location"
				name="location"
				value={profile.location || ""}
				onChange={handleInputChange}
				required
			/>
			<InputField
				label="Año de fundación"
				id="founded_year"
				name="founded_year"
				value={profile.founded_year?.toString() || ""}
				onChange={handleInputChange}
				required
				type="number"
			/>
			<ChipSelector
				label="Beneficios"
				items={BENEFITS}
				selectedItems={profile.benefits || []}
				onItemSelect={(item: string) => handleAddItem(item, "benefits")}
				onItemRemove={(item: string) => handleRemoveItem(item, "benefits")}
			/>
		</>
	);
}
