import { 
    SiCloudflare, 
    SiVercel,
    SiGooglecloud,
    SiNginx,
    SiApache,
    SiElasticsearch,
    SiApachekafka,
    SiRabbitmq,
    SiDocker,
    SiKubernetes,
    SiMongodb,
    SiMysql,
    SiPrisma,
    SiMariadb,
    SiApachecassandra,
    SiCouchbase,
    SiInfluxdb,
    SiNeo4J,
    SiOracle,
    SiAmazondynamodb,
    SiFirebase
} from 'react-icons/si'
import { FaDatabase, FaNetworkWired, FaAws } from 'react-icons/fa'
import { BiData } from 'react-icons/bi'
import { MdApi, MdAnalytics, MdStorage, MdCloudQueue } from 'react-icons/md'
import { HiServer } from 'react-icons/hi'
import { RiCpuLine } from 'react-icons/ri'
import { BiLogoPostgresql } from "react-icons/bi"
import { DiRedis } from "react-icons/di"
import { VscAzure } from 'react-icons/vsc'

interface GetServiceLogoProps {
    serviceName: string
    kind?: string
    size?: 'small' | 'medium' | 'large'
}

export function getServiceLogo({ serviceName, kind, size = 'medium' }: GetServiceLogoProps) {
    const name = serviceName.toLowerCase()
    
    const sizeClasses = {
        small: 'h-6 w-6',
        medium: 'h-8 w-8',
        large: 'h-10 w-10'
    }
    
    const iconSize = sizeClasses[size]
    
    // Database services with branded logos
    if (name.includes('postgres') || name === 'postgresql') {
        return <BiLogoPostgresql className={`${iconSize} text-[#336791]`} />
    }
    if (name.includes('mysql')) {
        return <SiMysql className={`${iconSize} text-[#4479A1]`} />
    }
    if (name.includes('redis')) {
        return <DiRedis className={`${iconSize} text-[#DC382D]`} />
    }
    if (name.includes('mongo')) {
        return <SiMongodb className={`${iconSize} text-[#47A248]`} />
    }
    if (name.includes('prisma')) {
        return <SiPrisma className={`${iconSize} text-[#2D3748]`} />
    }
    if (name.includes('mariadb')) {
        return <SiMariadb className={`${iconSize} text-[#003545]`} />
    }
    if (name.includes('cassandra')) {
        return <SiApachecassandra className={`${iconSize} text-[#1287B1]`} />
    }
    if (name.includes('couchbase')) {
        return <SiCouchbase className={`${iconSize} text-[#EA2328]`} />
    }
    if (name.includes('influx')) {
        return <SiInfluxdb className={`${iconSize} text-[#22ADF6]`} />
    }
    if (name.includes('neo4j')) {
        return <SiNeo4J className={`${iconSize} text-[#008CC1]`} />
    }
    if (name.includes('oracle')) {
        return <SiOracle className={`${iconSize} text-[#F80000]`} />
    }
    
    if (name.includes('dynamodb')) {
        return <SiAmazondynamodb 
 className={`${iconSize} text-[#4053D6]`} />
    }
    if (name.includes('firebase')) {
        return <SiFirebase className={`${iconSize} text-[#FFCA28]`} />
    }
    
    // Use branded Simple Icons logos
    if (name.includes('cloudflare')) {
        return <SiCloudflare className={`${iconSize} text-orange-500`} />
    }
    if (name.includes('vercel')) {
        return <SiVercel className={`${iconSize} text-black`} />
    }
    if (name.includes('nginx')) {
        return <SiNginx className={`${iconSize} text-green-500`} />
    }
    if (name.includes('apache')) {
        return <SiApache className={`${iconSize} text-red-500`} />
    }
    if (name.includes('elasticsearch') || name.includes('elastic')) {
        return <SiElasticsearch className={`${iconSize} text-yellow-400`} />
    }
    if (name.includes('kafka')) {
        return <SiApachekafka className={`${iconSize} text-black`} />
    }
    if (name.includes('rabbitmq') || name.includes('rabbit')) {
        return <SiRabbitmq className={`${iconSize} text-orange-500`} />
    }
    if (name.includes('docker')) {
        return <SiDocker className={`${iconSize} text-blue-500`} />
    }
    if (name.includes('kubernetes') || name.includes('k8s')) {
        return <SiKubernetes className={`${iconSize} text-blue-500`} />
    }
    
    // AWS/Azure/GCP services
    if (name.includes('aws') || name.includes('s3') || name.includes('ec2') || name.includes('lambda')) {
        return <FaAws className={`${iconSize} text-orange-400`} />
    }
    if (name.includes('azure')) {
        return <VscAzure className={`${iconSize} text-blue-500`} />
    }
    if (name.includes('gcp') || name.includes('google cloud')) {
        return <SiGooglecloud className={`${iconSize} text-blue-400`} />
    }
    
    // Use React Icons for specific service types
    if (name.includes('edge')) {
        return <FaNetworkWired className={`${iconSize} text-purple-500`} />
    }
    if (name.includes('worker')) {
        return <RiCpuLine className={`${iconSize} text-purple-500`} />
    }
    if (name.includes('storage')) {
        return <MdStorage className={`${iconSize} text-blue-500`} />
    }
    if (name.includes('api') || name.includes('core')) {
        return <MdApi className={`${iconSize} text-blue-500`} />
    }
    if (name.includes('cache')) {
        return <BiData className={`${iconSize} text-green-500`} />
    }
    if (name.includes('analytics') || name.includes('analytic')) {
        return <MdAnalytics className={`${iconSize} text-purple-500`} />
    }
    if (name.includes('queue') || name.includes('message')) {
        return <MdCloudQueue className={`${iconSize} text-orange-500`} />
    }
    
    // Default fallback based on service kind
    if (kind === 'database') {
        return <FaDatabase className={`${size === 'small' ? 'h-5 w-5' : iconSize} text-blue-400`} />
    }
    return <HiServer className={`${size === 'small' ? 'h-5 w-5' : iconSize} text-purple-400`} />
}
