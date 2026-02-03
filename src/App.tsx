import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Home pages
import WelcomeMessage from "./pages/home/WelcomeMessage";
import FastFacts from "./pages/home/FastFacts";
import VirtualTour from "./pages/home/VirtualTour";
import NewsTicker from "./pages/home/NewsTicker";
import EmergencyAlerts from "./pages/home/EmergencyAlerts";

// About pages
import HistoryMission from "./pages/about/HistoryMission";
import Leadership from "./pages/about/Leadership";
import Accreditation from "./pages/about/Accreditation";
import CampusMap from "./pages/about/CampusMap";
import Sustainability from "./pages/about/Sustainability";
import DiversityInclusion from "./pages/about/DiversityInclusion";

// Academic pages
import PhDPrograms from "./pages/academics/PhDPrograms";
import SchoolArts from "./pages/academics/SchoolArts";
import SchoolScience from "./pages/academics/SchoolScience";
import CollegeEngineering from "./pages/academics/CollegeEngineering";
import CollegeArtsSciences from "./pages/academics/CollegeArtsSciences";
import SchoolBusiness from "./pages/academics/SchoolBusiness";
import CollegeHealthSciences from "./pages/academics/CollegeHealthSciences";
import SchoolMedicine from "./pages/academics/SchoolMedicine";
import SchoolLaw from "./pages/academics/SchoolLaw";
import CollegeEducation from "./pages/academics/CollegeEducation";
import SchoolPublicHealth from "./pages/academics/SchoolPublicHealth";
import SchoolSocialWork from "./pages/academics/SchoolSocialWork";
import CollegeVeterinaryMedicine from "./pages/academics/CollegeVeterinaryMedicine";
import CourseCatalog from "./pages/academics/CourseCatalog";
import AcademicCalendar from "./pages/academics/AcademicCalendar";

// Department pages
import EnglishLiterature from "./pages/departments/EnglishLiterature";
import History from "./pages/departments/History";
import Biology from "./pages/departments/Biology";

// Admissions pages
import UndergraduateAdmissions from "./pages/admissions/UndergraduateAdmissions";
import GraduateAdmissions from "./pages/admissions/GraduateAdmissions";
import InternationalAdmissions from "./pages/admissions/InternationalAdmissions";
import TransferAdmissions from "./pages/admissions/TransferAdmissions";
import FinancialAid from "./pages/admissions/FinancialAid";
import CampusTours from "./pages/admissions/CampusTours";
import AdmissionApplication from "./pages/AdmissionApplication";
import PublicAdmissionForm from "./pages/PublicAdmissionForm";
import MultiStageApplicationForm from "./pages/MultiStageApplicationForm";
import FastTrackAdmission from "./pages/FastTrackAdmission";
import FastTrackSuccess from "./pages/FastTrackSuccess";

// Student Life pages
import Housing from "./pages/student-life/Housing";
import Dining from "./pages/student-life/Dining";
import HealthWellness from "./pages/student-life/HealthWellness";
import CareerServices from "./pages/student-life/CareerServices";
import StudentOrganizations from "./pages/student-life/StudentOrganizations";
import CampusRecreation from "./pages/student-life/CampusRecreation";
import ArtsCulture from "./pages/student-life/Artsculture";

// Research pages
import ResearchOffice from "./pages/research/ResearchOffice";
import UndergraduateResearch from "./pages/research/UndergraduateResearch";
import FundingOpportunities from "./pages/research/FundingOpportunities";
import CoreFacilities from "./pages/research/CoreFacilities";
import TechnologyTransfer from "./pages/research/TechnologyTransfer";

// Alumni pages
import AlumniAssociation from "./pages/alumni/AlumniAssociation";
import AlumniBenefits from "./pages/alumni/AlumniBenefits";
import AlumniEvents from "./pages/alumni/AlumniEvents";
import CareerNetworking from "./pages/alumni/CareerNetworking";
import GiveBack from "./pages/alumni/GiveBack";

// Colleges pages
import FullFledgedColleges from "./pages/colleges/FullFledgedColleges";
import OffshoreColleges from "./pages/colleges/OffshoreColleges";
import StudyCenters from "./pages/colleges/StudyCenters";

// Services pages  
import Libraries from "./pages/services/Libraries";
import WritingCenter from "./pages/services/WritingCenter";
import ITHelpDesk from "./pages/services/ITHelpDesk";
import ParkingTransportation from "./pages/services/ParkingTransportation";
import DisabilityServices from "./pages/services/DisabilityServices";

// Resources pages
import StudentHandbook from "./pages/resources/StudentHandbook";
import AcademicPolicies from "./pages/resources/AcademicPolicies";

// Legal pages
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfUse from "./pages/legal/TermsOfUse";
import TermsDisclaimer from "./pages/legal/TermsDisclaimer";
import PaymentPolicy from "./pages/legal/PaymentPolicy";
import TermsConditions from "./pages/legal/TermsConditions";
import RefundPolicy from "./pages/legal/RefundPolicy";
import Disclaimer from "./pages/legal/Disclaimer";
import Grievance from "./pages/legal/Grievance";
import ShippingPolicy from "./pages/legal/ShippingPolicy";
import AdmissionSuccess from "./pages/AdmissionSuccess";
import PaymentSuccess from "./pages/PaymentSuccess";
import ContactUs from "./pages/ContactUs";

// Forms pages
import FormsPortal from "./pages/forms/FormsPortal";
import FormSubmission from "./pages/forms/FormSubmission";
import MySubmissions from "./pages/forms/MySubmissions";

// Portal pages
import MyNSCU from "./pages/portal/MyNSCU";

// Site pages
import Sitemap from "./pages/Sitemap";
import Transparency from "./pages/Transparency";
import TransparencyDashboard from "./pages/dashboard/TransparencyDashboard";
import AnnualReports from "./pages/transparency/AnnualReports";
import FinancialStatements from "./pages/transparency/FinancialStatements";
import AccreditationCompliance from "./pages/transparency/AccreditationCompliance";

// New Phase 3 pages
import Athletics from "./pages/athletics/Athletics";
import ResearchCenters from "./pages/research/ResearchCenters";
import FacultyDirectory from "./pages/faculty/FacultyDirectory";
import CampusFacilities from "./pages/campus/CampusFacilities";
import InternationalPrograms from "./pages/international/InternationalPrograms";
import Collaborations from "./pages/international/Collaborations";

// Affiliation pages
import NSCUAffiliation from "./pages/affiliation/NSCUAffiliation";

// Campus Life pages
import GreekLife from "./pages/campus-life/GreekLife";
import IntramuralsSpecial from "./pages/campus-life/Intramurals";

// News pages
import UniversityNews from "./pages/news/UniversityNews";
import PressReleases from "./pages/news/PressReleases";
import PressReleaseDetail from "./pages/news/PressReleaseDetail";

// Additional Departments
import ComputerScience from "./pages/departments/ComputerScience";

// Program pages
import BachelorArtsEnglish from "./pages/programs/BachelorArtsEnglish";
import MasterArtsHistory from "./pages/programs/MasterArtsHistory";
import MasterFineArtsCreativeWriting from "./pages/programs/MasterFineArtsCreativeWriting";
import BachelorScienceBiology from "./pages/programs/BachelorScienceBiology";
import BachelorEngineering from "./pages/programs/BachelorEngineering";
import MasterBusinessAdministration from "./pages/programs/MasterBusinessAdministration";
import BachelorNursing from "./pages/programs/BachelorNursing";
import DoctorMedicine from "./pages/programs/DoctorMedicine";
import MasterSocialWork from "./pages/programs/MasterSocialWork";
import BachelorFineArts from "./pages/programs/BachelorFineArts";
import BachelorPharmacy from "./pages/programs/BachelorPharmacy";
import DoctorPharmacy from "./pages/programs/DoctorPharmacy";
import MasterPharmacy from "./pages/programs/MasterPharmacy";
import MasterMedicine from "./pages/programs/MasterMedicine";
import DynamicCoursePage from "./pages/programs/DynamicCoursePage";
import DynamicPage from "./pages/DynamicPage";

// Dynamic Academic Pages
import DynamicFacultyPage from "./pages/faculty/DynamicFacultyPage";
import DynamicDepartmentPage from "./pages/department/DynamicDepartmentPage";
import DegreeCourseListing from "./pages/department/DegreeCourseListing";

// Public Course Catalog
import PublicCourseCatalog from "./pages/courses/PublicCourseCatalog";
import CourseDetailPage from "./pages/courses/CourseDetailPage";
import CourseEnrollment from "./pages/CourseEnrollment";

// Job pages
import CareersPage from "./pages/careers/CareersPage";
import JobDetailPage from "./pages/careers/JobDetailPage";
import JobApplicationForm from "./pages/careers/JobApplicationForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Career Routes */}
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/careers/:slug" element={<JobDetailPage />} />
            <Route path="/careers/:slug/apply" element={<JobApplicationForm />} />
          
          {/* Home Routes */}
          <Route path="/home/welcome" element={<WelcomeMessage />} />
          <Route path="/home/fast-facts" element={<FastFacts />} />
          <Route path="/home/virtual-tour" element={<VirtualTour />} />
          <Route path="/home/news" element={<NewsTicker />} />
          <Route path="/home/emergency" element={<EmergencyAlerts />} />
          
          {/* About Routes */}
          <Route path="/about/history-mission" element={<HistoryMission />} />
          <Route path="/about/leadership" element={<Leadership />} />
          <Route path="/about/accreditation" element={<Accreditation />} />
          <Route path="/about/campus-map" element={<CampusMap />} />
          <Route path="/about/sustainability" element={<Sustainability />} />
          <Route path="/about/diversity-inclusion" element={<DiversityInclusion />} />
          
          {/* Academic Routes */}
          <Route path="/academics/phd-programs" element={<PhDPrograms />} />
          <Route path="/academics/school-arts" element={<SchoolArts />} />
          <Route path="/academics/school-science" element={<SchoolScience />} />
          <Route path="/academics/college-engineering" element={<CollegeEngineering />} />
          <Route path="/academics/college-arts-sciences" element={<CollegeArtsSciences />} />
          <Route path="/academics/school-business" element={<SchoolBusiness />} />
          <Route path="/academics/college-health-sciences" element={<CollegeHealthSciences />} />
          <Route path="/academics/school-medicine" element={<SchoolMedicine />} />
          <Route path="/academics/school-law" element={<SchoolLaw />} />
          <Route path="/academics/college-education" element={<CollegeEducation />} />
          <Route path="/academics/school-public-health" element={<SchoolPublicHealth />} />
          <Route path="/academics/school-social-work" element={<SchoolSocialWork />} />
          <Route path="/academics/college-veterinary-medicine" element={<CollegeVeterinaryMedicine />} />
          <Route path="/academics/course-catalog" element={<CourseCatalog />} />
          <Route path="/academics/academic-calendar" element={<AcademicCalendar />} />
          
          {/* Department Routes */}
          <Route path="/departments/english-literature" element={<EnglishLiterature />} />
          <Route path="/departments/history" element={<History />} />
          <Route path="/departments/biology" element={<Biology />} />
          
          {/* Program Routes */}
          <Route path="/programs/bachelor-arts-english" element={<BachelorArtsEnglish />} />
          <Route path="/programs/master-arts-history" element={<MasterArtsHistory />} />
          <Route path="/programs/master-fine-arts-creative-writing" element={<MasterFineArtsCreativeWriting />} />
          <Route path="/programs/bachelor-science-biology" element={<BachelorScienceBiology />} />
          <Route path="/programs/bachelor-engineering" element={<BachelorEngineering />} />
          <Route path="/programs/master-business-administration" element={<MasterBusinessAdministration />} />
          <Route path="/programs/bachelor-nursing" element={<BachelorNursing />} />
          <Route path="/programs/doctor-medicine" element={<DoctorMedicine />} />
          <Route path="/programs/master-social-work" element={<MasterSocialWork />} />
          <Route path="/programs/bachelor-fine-arts" element={<BachelorFineArts />} />
          <Route path="/programs/bachelor-pharmacy" element={<BachelorPharmacy />} />
          <Route path="/programs/doctor-pharmacy" element={<DoctorPharmacy />} />
          <Route path="/programs/master-pharmacy" element={<MasterPharmacy />} />
          <Route path="/programs/master-medicine" element={<MasterMedicine />} />
          <Route path="/programs/:slug" element={<DynamicCoursePage />} />
          
          {/* Admissions Routes */}
          <Route path="/admissions/undergraduate" element={<UndergraduateAdmissions />} />
          <Route path="/admissions/graduate" element={<GraduateAdmissions />} />
          <Route path="/admissions/international" element={<InternationalAdmissions />} />
          <Route path="/admissions/transfer" element={<TransferAdmissions />} />
          <Route path="/admissions/financial-aid" element={<FinancialAid />} />
          <Route path="/admissions/tours" element={<CampusTours />} />
          <Route path="/admissions/apply" element={<AdmissionApplication />} />
          <Route path="/apply" element={<PublicAdmissionForm />} />
          <Route path="/apply/full" element={<MultiStageApplicationForm />} />
          <Route path="/apply/fast-track" element={<FastTrackAdmission />} />
          <Route path="/fast-track-success" element={<FastTrackSuccess />} />
          
          {/* Student Life Routes */}
          <Route path="/student-life/housing" element={<Housing />} />
          <Route path="/student-life/dining" element={<Dining />} />
          <Route path="/student-life/health-wellness" element={<HealthWellness />} />
          <Route path="/student-life/career-services" element={<CareerServices />} />
          <Route path="/student-life/organizations" element={<StudentOrganizations />} />
          <Route path="/student-life/recreation" element={<CampusRecreation />} />
          <Route path="/student-life/artsculture" element={<ArtsCulture />} />
          
          {/* Research Routes */}
          <Route path="/research/office" element={<ResearchOffice />} />
          <Route path="/research/undergraduate" element={<UndergraduateResearch />} />
          <Route path="/research/funding" element={<FundingOpportunities />} />
          <Route path="/research/core-facilities" element={<CoreFacilities />} />
          <Route path="/research/technology-transfer" element={<TechnologyTransfer />} />
          <Route path="/research/centers" element={<ResearchCenters />} />
          
          {/* Athletics Routes */}
          <Route path="/athletics" element={<Athletics />} />
          
          {/* Faculty Routes */}
          <Route path="/faculty/directory" element={<FacultyDirectory />} />
          
          {/* Campus Routes */}
          <Route path="/campus/facilities" element={<CampusFacilities />} />
          
          {/* International Routes */}
          <Route path="/international/programs" element={<InternationalPrograms />} />
          <Route path="/international/collaborations" element={<Collaborations />} />
          
          {/* Alumni Routes */}
          <Route path="/alumni/association" element={<AlumniAssociation />} />
          <Route path="/alumni/benefits" element={<AlumniBenefits />} />
          <Route path="/alumni/events" element={<AlumniEvents />} />
          <Route path="/alumni/career-networking" element={<CareerNetworking />} />
          <Route path="/alumni/give-back" element={<GiveBack />} />
          
          {/* Colleges Routes */}
          <Route path="/colleges/full-fledged" element={<FullFledgedColleges />} />
          <Route path="/colleges/offshore" element={<OffshoreColleges />} />
          <Route path="/colleges/study-centers" element={<StudyCenters />} />
          
          {/* Affiliation Routes */}
          <Route path="/affiliation/nscu-affiliation" element={<NSCUAffiliation />} />
          
          {/* Services Routes */}
          <Route path="/services/libraries" element={<Libraries />} />
          <Route path="/services/writing-center" element={<WritingCenter />} />
          <Route path="/services/it-help-desk" element={<ITHelpDesk />} />
          <Route path="/services/parking-transportation" element={<ParkingTransportation />} />
          <Route path="/services/disability-services" element={<DisabilityServices />} />
          
          {/* Resources Routes */}
          <Route path="/resources/student-handbook" element={<StudentHandbook />} />
          <Route path="/resources/academic-policies" element={<AcademicPolicies />} />
          
          {/* Legal Routes */}
          <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/legal/terms-of-use" element={<TermsOfUse />} />
          <Route path="/legal/terms-disclaimer" element={<TermsDisclaimer />} />
          <Route path="/legal/payment-policy" element={<PaymentPolicy />} />
          <Route path="/legal/terms-conditions" element={<TermsConditions />} />
          <Route path="/legal/refund-policy" element={<RefundPolicy />} />
          <Route path="/legal/disclaimer" element={<Disclaimer />} />
          <Route path="/legal/grievance" element={<Grievance />} />
          <Route path="/legal/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/admission-success" element={<AdmissionSuccess />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/contact" element={<ContactUs />} />
          
          {/* Forms Routes */}
          <Route path="/forms" element={<FormsPortal />} />
          <Route path="/forms/my-submissions" element={<MySubmissions />} />
          <Route path="/forms/:slug" element={<FormSubmission />} />
          
          {/* Campus Life Routes */}
          <Route path="/campus-life/greek-life" element={<GreekLife />} />
          <Route path="/campus-life/intramurals" element={<IntramuralsSpecial />} />
          
          {/* Portal Routes */}
          <Route path="/portal/mynscu" element={<MyNSCU />} />
          
          {/* Site Routes */}
          <Route path="/sitemap" element={<Sitemap />} />
          
          {/* News Routes */}
          <Route path="/news/university-news" element={<UniversityNews />} />
          <Route path="/news/press-releases" element={<PressReleases />} />
          <Route path="/news/press-release/:id" element={<PressReleaseDetail />} />
          
          {/* Additional Department Routes */}
          <Route path="/departments/computer-science" element={<ComputerScience />} />
          
          {/* Transparency Routes */}
          <Route path="/transparency" element={<Transparency />} />
          <Route path="/transparency/annual-reports" element={<AnnualReports />} />
          <Route path="/transparency/financial-statements" element={<FinancialStatements />} />
          <Route path="/transparency/accreditation" element={<AccreditationCompliance />} />
          <Route path="/dashboard/transparency" element={<TransparencyDashboard />} />
          
          {/* Public Course Catalog Routes */}
          <Route path="/courses" element={<PublicCourseCatalog />} />
          <Route path="/courses/:slug" element={<CourseDetailPage />} />
          <Route path="/courses/:slug/enroll" element={<CourseEnrollment />} />
          
          {/* Dynamic Academic Routes - Faculty, Department, Degree Level */}
          <Route path="/faculty/:slug" element={<DynamicFacultyPage />} />
          <Route path="/department/:slug" element={<DynamicDepartmentPage />} />
          <Route path="/department/:slug/:degreeType" element={<DegreeCourseListing />} />
          
          {/* Dynamic CMS Pages - catches any slug not matched above */}
          <Route path="/page/:slug" element={<DynamicPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
