import React from 'react';
import { 
  X, 
  FileCheck, 
  Clock, 
  ShieldCheck, 
  Users, 
  TrendingDown, 
  Download, 
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { PostEventReport, PredictionResult } from '../../types';

interface PostEventReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: PredictionResult;
  report?: PostEventReport;
}

export const PostEventReportModal: React.FC<PostEventReportModalProps> = ({
  isOpen,
  onClose,
  prediction,
  report,
}) => {
  if (!isOpen) return null;

  const defaultTimeline = [
    {
      timeOffsetMin: 0,
      clockTime: '08:40:12',
      title: 'Sensor Telemetry Anomaly Detected',
      description: 'North Fault Station #101 registered 440 μstrain dilatancy & low-frequency foreshock resonance.',
      category: 'PREDICTION' as const,
    },
    {
      timeOffsetMin: 1.2,
      clockTime: '08:41:24',
      title: 'AI Threat Gauge Reached EXTREME (92% Likelihood)',
      description: 'Ensemble model computed 9 min lead time. Concentric Alpha (5km) and Beta (10km) geofences generated.',
      category: 'ALERT' as const,
    },
    {
      timeOffsetMin: 2.0,
      clockTime: '08:42:15',
      title: 'Multi-Channel Alert Dispatched (52,600 Devices)',
      description: 'Cell-Broadcast Ch 4370 & SMS Gateway triggered. Zone Alpha immediate green route assigned.',
      category: 'ALERT' as const,
    },
    {
      timeOffsetMin: 3.5,
      clockTime: '08:43:45',
      title: 'Staggered Hold Enacted for Zone Beta (12 Min Countdown)',
      description: 'Perimeter residents held in place to keep Westside Arterial clear for Zone Alpha evacuees.',
      category: 'STAGGER_DISPATCH' as const,
    },
    {
      timeOffsetMin: 8.5,
      clockTime: '08:48:42',
      title: 'Zone Alpha 94.2% Evacuation Clearance Achieved',
      description: '4,800 vehicles cleared through primary corridor with 0 highway gridlock choke points.',
      category: 'SHELTER' as const,
    },
    {
      timeOffsetMin: 12.0,
      clockTime: '08:52:12',
      title: 'Zone Beta Window Opened — Secondary Corridor Transit',
      description: 'Secondary Arterial Route B engaged. All 4 Safe Reception Shelters operating under 70% capacity.',
      category: 'SAFETY' as const,
    },
  ];

  const timeline = report?.timeline || defaultTimeline;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl max-w-3xl w-full p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto text-[#E4E4E7]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-black text-purple-400 border border-[#27272A]">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
                Post-Event After-Action Report (AAR)
              </h2>
              <p className="text-xs text-[#71717A] font-mono">
                Automated Incident Timeline & Evacuation Efficacy Audit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#71717A] hover:text-white p-1.5 rounded-lg hover:bg-black transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* High-Level Impact Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-black p-3.5 rounded-xl border border-[#27272A] font-mono">
            <div className="text-[10px] text-[#71717A] uppercase tracking-wider">Warning Lead Time</div>
            <div className="text-xl font-bold text-orange-400 mt-1">
              +{prediction.estimatedTimeToImpactMin || 12}m
            </div>
            <div className="text-[9px] text-[#71717A]">Pre-impact lead</div>
          </div>

          <div className="bg-black p-3.5 rounded-xl border border-[#27272A] font-mono">
            <div className="text-[10px] text-[#71717A] uppercase tracking-wider">Alpha Clearance</div>
            <div className="text-xl font-bold text-green-400 mt-1">
              96.4%
            </div>
            <div className="text-[9px] text-[#71717A]">10 min window</div>
          </div>

          <div className="bg-black p-3.5 rounded-xl border border-[#27272A] font-mono">
            <div className="text-[10px] text-[#71717A] uppercase tracking-wider">Gridlock Cut</div>
            <div className="text-xl font-bold text-purple-400 mt-1">
              -68.2%
            </div>
            <div className="text-[9px] text-[#71717A]">Via stagger hold</div>
          </div>

          <div className="bg-black p-3.5 rounded-xl border border-[#27272A] font-mono">
            <div className="text-[10px] text-[#71717A] uppercase tracking-wider">Lives Protected</div>
            <div className="text-xl font-bold text-white mt-1">
              {(prediction.affectedPopulation || 142000).toLocaleString()}
            </div>
            <div className="text-[9px] text-[#71717A]">Target population</div>
          </div>
        </div>

        {/* Incident Timeline */}
        <div className="bg-black p-5 rounded-xl border border-[#27272A]">
          <h3 className="text-xs font-bold text-[#71717A] uppercase tracking-wider mb-4 flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            Incident Timeline
          </h3>

          <div className="space-y-4 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-[#27272A] pl-6 font-mono">
            {timeline.map((event, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-black" />
                <div className="flex items-baseline justify-between text-xs mb-1">
                  <span className="font-bold text-white">{event.title}</span>
                  <span className="text-[10px] text-purple-400 font-bold">{event.clockTime}</span>
                </div>
                <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#27272A] text-xs font-mono">
          <div className="text-[#71717A] text-[10px]">
            Certified for NDMA / State Emergency Operations Center (SEOC)
          </div>
          <button
            onClick={() => {
              window.print();
            }}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-wider flex items-center gap-2 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF Report</span>
          </button>
        </div>

      </div>
    </div>
  );
};
