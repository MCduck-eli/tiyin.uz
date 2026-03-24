"use client";

import { ArrowRight, Clock, ExternalLink, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface NewsItem {
    id: string | number;
    url: string;
    image: string;
    datetime: number;
    headline: string;
}

interface NewProps {
    newsLoading: boolean;
    news: NewsItem[] | null | undefined;
}

export default function NewNews({ newsLoading, news }: NewProps) {
    return (
        <section className="w-full max-w-7xl px-6 mt-24">
            <div className="flex items-end justify-between mb-8 pb-4 border-b border-border/40">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                        <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter uppercase leading-none text-foreground">
                            Yangiliklar
                        </h2>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1.5">
                            Market Insights
                        </p>
                    </div>
                </div>
                <Link href="/news" className="group">
                    <div className="flex items-center gap-2.5 px-4 py-2 rounded-full hover:bg-muted transition-all duration-300 border border-transparent hover:border-border/50">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                            Barcha yangiliklar
                        </span>
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            <ArrowRight className="w-3 h-3" />
                        </div>
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {newsLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                          <div
                              key={i}
                              className="h-[320px] rounded-[32px] bg-muted/20 animate-pulse border border-border/50"
                          />
                      ))
                    : news?.map((item: NewsItem) => (
                          <motion.a
                              key={item.id}
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4 }}
                              className="group relative flex flex-col rounded-[32px] bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all shadow-sm overflow-hidden min-h-[320px]"
                          >
                              <div className="relative h-32 w-full overflow-hidden bg-muted">
                                  <img
                                      src={
                                          item.image ||
                                          "/api/placeholder/400/320"
                                      }
                                      alt=""
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                  />
                              </div>
                              <div className="p-5 flex flex-col justify-between flex-1">
                                  <div className="space-y-3">
                                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold">
                                          <Clock className="w-3 h-3 text-primary" />
                                          {new Date(
                                              item.datetime * 1000,
                                          ).toLocaleTimeString("uz-UZ", {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          })}
                                      </div>
                                      <h3 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-3">
                                          {item.headline}
                                      </h3>
                                  </div>
                                  <div className="pt-4 flex items-center justify-between border-t border-border/20">
                                      <span className="text-[9px] font-black uppercase text-primary tracking-widest">
                                          Batafsil
                                      </span>
                                      <ExternalLink className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
                                  </div>
                              </div>
                          </motion.a>
                      ))}
            </div>
        </section>
    );
}
